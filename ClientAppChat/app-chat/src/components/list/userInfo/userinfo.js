import React, { useState } from 'react';
import './userinfo.css';
import {FaEllipsisH, FaVideo, FaPenSquare} from 'react-icons/fa';
function UserInfo() {
    return (
        <div className='userInfo'>
            <div className='user'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <h2>Vu Luu</h2>
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