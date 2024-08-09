import React, { useState } from 'react';
import './userinfo.css';
import {FaEllipsisH, FaVideo, FaPenSquare} from 'react-icons/fa';
function UserInfo() {
    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');
    const img = localStorage.getItem('img');
    console.log(img)
    const [userImg, setUserImg] = useState('./defaultAvt.png');
    const UserImgComponent = () => <img src={img} alt="User profile"/>;
    return (
        <div className='userInfo'>
            <div className='user'>
            <img src={img} alt="User profile"/>
                <h2>{userName}</h2>
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