import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/chatHome.css';
import Chat from './chat/chat.js';
import Details from './details/details.js';
import List from './list/list.js';
function Home() {

    // list chat
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = ''; // Thay thế bằng token thực sự nếu có
    const email = localStorage.getItem('email');
    
    // user chatting
    const [chattingWith, setChattingWith] = useState('');
    // user chat Loading
    const [chattingWithLoading, setChattingWithLoading] = useState(true);
    const [userChatLoading, setUserChatLoading] = useState(true); 
    
    // chatting content
    const [chattingContent, setChattingContent] = useState('');

    const user = {
        userName: localStorage.getItem('userName'),
        email: localStorage.getItem('email'),
        img: localStorage.getItem('img'),
    };

    useEffect(() => {
        const fetchChatList = async () => {
            try {

                const fetchPromise = await axios.get('http://localhost:5133/api/chat/user-chat-list', {
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
                    console.log(chattingWith)
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
            console.log(user.email)
            console.log(chattingWith.userId);
            try {
                const fetchPromise = await axios.get(`http://localhost:5133/api/chat/messages/${user.email}/${chattingWith.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
                const [response] = await Promise.all([fetchPromise, delayPromise]);
                setChattingContent(response.data);
                console.log(response.data)
                console.log(chattingContent);
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

    const handleChatClick = (user) => {
        setChattingWith(user);
    };

    return (
        <div className="background-image">
        <div className='overlay'>
                <div className='main-container-chat'>
                    <List userInfo = {user} chatList={chatList} loading = {loading} onChatClick={handleChatClick}></List>
                    <Chat chattingWith={chattingWith} loadingUser={chattingWithLoading} userChatLoading={userChatLoading} chattingContent={chattingContent}></Chat>
                    <Details></Details>
                </div>
            </div>
        </div>
    );
} 

export default Home;