import React, { useState } from 'react';
import {FaGlassCheers} from 'react-icons/fa';
import './chatlist.css';

function ChatList() {
    const [addMode, setAddMode] = useState(false);
    
    return (
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png'></img>
                    <input type='text' placeholder='Search'></input>
                </div>
                <img src={addMode ? './minus.png' : './plus.png'}
                    className='add'
                    onClick={() => setAddMode((pre) => !pre)}
                />
            </div>

            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
            <div className='item'>
                <img src='https://thicc-af.mywaifulist.moe/waifus/yukino-yukinoshita-my-teen-romantic-comedy-snafu/59uCJPfF6Qx5DMh2yMpzG0F39VxNqtHqVkTUXPIi_thumbnail.jpg'/>
                <div className='texts'>
                    <span>Minh Tu</span>
                    <p>?</p>
                </div>
            </div>
        </div>
    );
}

export default ChatList;