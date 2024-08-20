import React, { useState } from 'react';
import './list.css';
import UserInfo from './userInfo/userinfo';
import ChatList from './chatlist/chatlist';
function List({ userInfo, chatList, loading, onChatClick,updateProfile }) {
    return (
        <div className='list'>
            <UserInfo
                userInfo={userInfo}
                updateProfile={updateProfile}
            >               
                </UserInfo>
            <ChatList chatList={chatList} loading = {loading} onChatClick={onChatClick}></ChatList>
        </div>
    );
}

export default List;