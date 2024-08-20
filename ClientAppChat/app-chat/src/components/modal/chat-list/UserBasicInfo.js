import React from 'react';
import { FaCamera } from 'react-icons/fa';

const UserInfo = ({ userInfo, onCameraClick }) => (
    <div className='user-modal-info'>
        <div className='user-basic-info'>
            <img src={userInfo.img} alt='user-img' onClick={onCameraClick} />
            <FaCamera className='camera-icon' onClick={onCameraClick} />
            <h2>{userInfo.userName}</h2>
        </div>
        <div className='user-main-info'>
            <h2>Personal information</h2>
            <ul className='user-details'>
                <li>
                    <span className='label'>First Name:</span> 
                    <span className='value'>Vu</span>
                </li>
                <li>
                    <span className='label'>Last Name:</span> 
                    <span className='value'>Luu</span>
                </li>
                <li>
                    <span className='label'>Gender:</span> 
                    <span className='value'>Male</span>
                </li>
                <li>
                    <span className='label'>Dob:</span> 
                    <span className='value'>08/11/2003</span>
                </li>
            </ul>
            <p>Only people who are friends with you can see this information.</p>
        </div>
    </div>
);

export default UserInfo;
