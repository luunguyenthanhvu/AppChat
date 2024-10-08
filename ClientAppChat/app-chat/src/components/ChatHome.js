import React, { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../config.js';
import axios from 'axios';
import '../css/chatHome.css';
import Chat from './chat/chat.js';
import Details from './details/details.js';
import List from './list/list.js';
import Swal from 'sweetalert2';
import useChat from './hook/useChat.js';
function Home() {
    const navigate = useNavigate();
    // list chat
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token =  localStorage.getItem('token');
    const email = localStorage.getItem('email');
    console.log("sau khi login " + token + email)
    // for user search for them friend
    const [searchFriend, setSearchFriend] = useState('');

    // user chatting
    const [chattingWith, setChattingWith] = useState('');
    // user chat Loading
    const [chattingWithLoading, setChattingWithLoading] = useState(true);
    const [userChatLoading, setUserChatLoading] = useState(true); 
    
    // chatting content
    const [chattingContent, setChattingContent] = useState('');

    // chatting 
    const { newListChat ,messages, serverMessage, userInfo,sendMessage, updateProfile,updatePass, updateChatList ,updateChatListWithId} = useChat(); 

    const [user, setUser] = useState({
        userName: localStorage.getItem('userName'),
        email: localStorage.getItem('email'),
        img: localStorage.getItem('img'),
        token: localStorage.getItem('token')
    });

    const getLastTenMessages = () => {
        if (chattingContent.length > 0) {
            console.log( chattingContent[chattingContent.length - 1])
            return chattingContent[chattingContent.length - 1];
        }
    }

    useEffect(() => {
        const fetchChatList = async () => {
            try {
                const fetchPromise = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/user-chat-list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: email
                    }
                });

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

                // Đợi cả hai Promise hoàn thành
                const [response] = await Promise.all([fetchPromise, delayPromise]);
                setChatList(response.data);
                if (response.data && !chattingWith) {
                    setChattingWith(response.data[0])
                    console.log('dag chat voi ' + JSON.stringify(response.data[0]))
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
                setChattingWithLoading(false);
            }
        };

        if (email) {
            fetchChatList();
        }
    }, [email, token]);
    
    useEffect(() => {
        const fetchChatWithUser = async () => {
            setUserChatLoading(true);
            try {
                const fetchPromise = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/messages/${user.email}/${chattingWith.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
                const [response] = await Promise.all([fetchPromise, delayPromise]);
                setChattingContent(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setUserChatLoading(false);
            }
        }

        if (chattingWith) {
            fetchChatWithUser();
        }
    }, [chattingWith, user.email, token])
    
    useEffect(() => {
        if (chattingWith.userId === messages.receiverId ||
            chattingWith.userId === messages.senderId
        ) {
            const lastMessage = getLastTenMessages();
            const isDuplicate = lastMessage && lastMessage.messageId === messages.messageId;

            if (!isDuplicate) {
                setChattingContent(prev => [...prev, messages]);
            }
        }
    }, [chattingWith, messages])

    useEffect(() => {
        setChatList(newListChat)
    }, [newListChat])

    // get the server message send to user account
    useEffect(() => {
        if (serverMessage === "password changed") { 
            let timerInterval;
            Swal.fire({
                title: "Log out of account",
                html: "Account have new password please login again",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        const timer = Swal.getHtmlContainer().querySelector("b");
                        if (timer) {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    localStorage.clear();
                    navigate('/login');
                }
            });
        }
    }, [serverMessage]);
    
    // user find them friend
    useEffect(() => {
        const fetchChatList = async () => {
            setLoading(true);
            try {
                const fetchPromise = await axios.get(`http://${BACKEND_URL_HTTP}/api/chat/friend-chat-list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: email,
                        username: searchFriend
                    }
                });

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

                // Đợi cả hai Promise hoàn thành
                const [response] = await Promise.all([fetchPromise, delayPromise]);
                setChatList(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
                setChattingWithLoading(false);
            }
        };

        if (email) {
            fetchChatList();
        }
    }, [searchFriend])

    useEffect(() => {
        setUser(({
            userName: localStorage.getItem('userName'),
            email: localStorage.getItem('email'),
            img: localStorage.getItem('img'),
            token: localStorage.getItem('token')
        }));
    }, [userInfo])


    const handleChatClick = (user) => {
        setChattingWith(user);
    };

    return (
        <div className="background-image">
        <div className='overlay'>
                <div className='main-container-chat'>
                    <List
                        userInfo={user}
                        chatList={chatList}
                        loading={loading}
                        onChatClick={handleChatClick}
                        updateProfile={updateProfile}
                        updatePassServer={updatePass}
                        setSearchFriend={setSearchFriend}
                        searchFriend={searchFriend}
                        updateChatList={updateChatList}
                    >
                    </List>
                    
                    <Chat
                        chattingWith={chattingWith}
                        loadingUser={chattingWithLoading}
                        userChatLoading={userChatLoading}
                        chattingContent={chattingContent}
                        sendMessage={sendMessage}
                    ></Chat>
                    
                    <Details
                        chattingWith={chattingWith}
                        loadingUser={chattingWithLoading}
                        updateChatListWithId={updateChatListWithId}
                    >

                    </Details>
                </div>
            </div>
        </div>
    );
} 

export default Home;