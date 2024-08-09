import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatlist.css'; // Đảm bảo rằng bạn đã có CSS cần thiết

function ChatList() {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Khai báo biến error
    const [addMode, setAddMode] = useState(false);
    const token = ''; // Thay thế bằng token thực sự nếu có
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchChatList = async () => {
            try {
                const response = await axios.get('http://localhost:5133/api/chat/user-chat-list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: email // Thêm query parameter vào yêu cầu
                    }
                });
                setChatList(response.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load chat list");
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchChatList();
        }
    }, [email, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png' alt='Search' />
                    <input type='text' placeholder='Search' />
                </div>
                <img 
                    src={addMode ? './minus.png' : './plus.png'}
                    className='add'
                    alt='Toggle add mode'
                    onClick={() => setAddMode(prev => !prev)}
                />
            </div>

            {chatList.map((chat, index) => (
                <div key={index} className='item'>
                    <img src={chat.img} alt={`${chat.userName}'s avatar`} />
                    <div className='texts'>
                        <span>{chat.userName}</span>
                        <p>{chat.lastMessage || "?"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatList;
