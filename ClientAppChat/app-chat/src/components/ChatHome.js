import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/chatHome.css';
import Chat from './chat/chat.js';
import Details from './details/details.js';
import List from './list/list.js';
function Home() {
    return (
        <div className="background-image">
        <div className='overlay'>
                <div className='main-container-chat'>
                    <List></List>
                    <Chat></Chat>
                    <Details></Details>
                </div>
            </div>
        </div>
    );
} 

export default Home;