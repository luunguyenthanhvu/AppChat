import React, { useState } from 'react';
import './userinfo.css';
import {FaEllipsisH, FaVideo, FaPenSquare} from 'react-icons/fa';
function UserInfo({userInfo}) {
    return (
        <div className='userInfo'>
            <div className='user'>
            <img src={userInfo.img} alt="User profile"/>
                <h2>{userInfo.userName}</h2>
            </div>

            <div className='icons'>
                <label>
                    <FaEllipsisH/>
                </label>
                <label>
                    <FaVideo/>
                </label>
                <label>
                    <FaPenSquare/>
                </label>
            </div>
        </div>
    );
}

export default UserInfo;