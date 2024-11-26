import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatlist.css'; 
import Loader from "react-spinners/SyncLoader";


function ChatList({ chatList, loading, onChatClick, searchFriend,setSearchFriend }) {

    if (loading) return (
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png' alt='Search' />
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchFriend}
                        onChange={(e) => {
                            console.log(e);
                            setSearchFriend(e.target.value)
                        }}
                    />
                </div>
            </div>
            <div className="loading-container">
                <Loader size={10} color={"#5183fe"} loading={loading} />
            </div>
        </div>
    ); 

    return (
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png' alt='Search' />
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchFriend}
                        onChange={(e) => {
                            console.log(e);
                            setSearchFriend(e.target.value)
                        }}
                    />
                </div>
            </div>

            
            {chatList.length === 0 ? (
                <div className='no-friends-message'>
                    <p>You don't have any friends named like this</p>
                    <p>Let's go and add some new friend</p>
                    <img src='./nofriendImg.png' alt='meme for no friend'/>
                </div>
            ) : (
                chatList.map((chat, index) => (
                    <div
                        key={chat.userId}
                        className='item'
                        onClick={() => onChatClick(chat)}
                    >
                        <img src={chat.img} alt={`${chat.userName}'s avatar`} />
                        <div className='texts'>
                            <span>{chat.userName}</span>
                            <p>{chat.messageContent || `You got no message with ${chat.userName}`}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ChatList;
