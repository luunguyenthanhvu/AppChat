import React, { useState } from 'react';
import { FaPaperPlane} from 'react-icons/fa';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
function Chat() {

    const [text, setText] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const handleEmoji = e => {
        setText(prev => prev + e.emoji);
        setOpenEmoji(false);
    }

    console.log(text);
    return (
        <div className='chat'>
            <div className='top'>
                <div className='user'>
                    <img src='./avatar.jpg' />
                    <div className='texts'>
                        <span>Vu Luu</span>
                    </div>
                </div>

                <div className='icons'>
                    <img src='./phone.png'/>
                    <img src='./video.png'/>
                </div>
            </div>

            <div className='center'>
                <div className='message'>
                    <img src='./avatar.jpg' />
                    <div className='texts'>
                        <p>
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className='message own'>
                    <div className='texts'>
                        <p>
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className='message own'>
                    <div className='texts'>
                        <p>
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
            </div>

            <div className='bottom'>
                <div className='icons'>
                    <img src='./img.png'/>
                    <img src='./camera.png'/>
                    <img src='./mic.png'/>
                </div>

                <input type='text'
                    value={text}
                    placeholder='Type a message...'
                    onChange={e => setText(e.target.value)} />
                
                 <div className='emoji'>
                    <img src='./emoji.png' onClick={() => setOpenEmoji((prev) => !prev) }/>
                    <div className='picker'>
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button className='sendButton'>
                 
                    <FaPaperPlane/>
                </button>
            </div>
        </div>
    );
}

export default Chat;