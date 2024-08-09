import React, { useState } from 'react';
import './list.css';
import UserInfo from './userInfo/userinfo';
import ChatList from './chatlist/chatlist';
function List() {
    return (
        <div className='list'>
            <UserInfo></UserInfo>
            <ChatList></ChatList>
        </div>
    );
}

export default List;