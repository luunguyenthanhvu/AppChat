import React, { useState } from 'react';
import './list.css';
import UserInfo from './userInfo/userinfo';
import ChatList from './chatlist/chatlist';
function List({ userInfo, chatList, loading, onChatClick,updateProfile, updatePassServer,setSearchFriend,searchFriend,updateChatList}) {
    return (
        <div className='list'>
            <UserInfo
                userInfo={userInfo}
                updateProfile={updateProfile}
                updatePassServer={updatePassServer}
                updateChatList={updateChatList}
            >               
            </UserInfo>
            
            <ChatList
                chatList={chatList}
                loading={loading}
                onChatClick={onChatClick}
                setSearchFriend={setSearchFriend}
                searchFriend={searchFriend}
            >
                </ChatList>
        </div>
    );
}

export default List;