import React, { useState } from 'react';
import './details.css';
import { FaExclamationTriangle, FaUserMinus } from 'react-icons/fa';
import Loader from "react-spinners/SyncLoader";
function Details({loadingUser, chattingWith}) {

    console.log("chatting with ne" + JSON.stringify(chattingWith))

    if (loadingUser) {
        return (
            <div className='details'>
                    <div className="loading-user">
                        <Loader size={10} color={"#5183fe"} loading={loadingUser} />
                    </div>
            </div>
        );
    }
    return (
        <div className='details'>
            <div className='user-chatting-details'>
            <img src={chattingWith.img} />
            </div>

            <div className='user-chatting-details'>
                <h2>{chattingWith.userName}</h2>
            </div>

            <div className='user-chatting-details'>
                <div className='icons'>
                    <img className='add-group user' src='./profile-user.png' alt='User Info' />
                    <img className='add-group' src='./add-group.png' alt='Add Group' />
                    <FaUserMinus className='delete-friend'></FaUserMinus>
                </div>
            </div>

            
            <div className='user-chatting-details'>
                <div className='report-content'>
                    <FaExclamationTriangle/> Report This User
                </div>
            </div>
        </div>
    );
}

export default Details;