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
                    <span className='value'>{userInfo.firstName}</span>
                </li>
                <li>
                    <span className='label'>Last Name:</span> 
                    <span className='value'>{userInfo.lastName}</span>
                </li>
                <li>
                    <span className='label'>Gender:</span> 
                    <span className='value'>{userInfo.gender}</span>
                </li>
                <li>
                    <span className='label'>Dob:</span> 
                    <span className='value'>{userInfo.dob}</span>
                </li>
            </ul>
            <p>Only people who are friends with you can see this information.</p>
        </div>
    </div>
);

export default UserInfo;
