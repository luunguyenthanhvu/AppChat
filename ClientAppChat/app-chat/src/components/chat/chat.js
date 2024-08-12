import React, { useState } from 'react';
import { FaPaperPlane} from 'react-icons/fa';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import Loader from "react-spinners/SyncLoader";
import { formatDistanceToNow } from 'date-fns';
function Chat({chattingWith, loadingUser,userChatLoading, chattingContent, sendMessage}) {

    const [message, setMessage] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const handleEmoji = e => {
        setMessage(prev => prev + e.emoji);
        setOpenEmoji(false);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const handleSendMessage = () => {
        if (message) {
            console.log(chattingWith)
            sendMessage(chattingWith.userId, message)
            setMessage('');
        }
    }

    if (loadingUser) {
        return (
            <div className='chat'>
                <div className='top'>
                    <div className="loading-user">
                        <Loader size={10} color={"#5183fe"} loading={loadingUser} />
                    </div>
                </div>
                <div className='center'>
                    <div className="loading-chat-content">
                        <Loader size={10} color={"#5183fe"} loading={userChatLoading} />
                    </div>
                </div>
            </div>
        );
    } 
        
    if (userChatLoading) {
        return (
            <div className='chat'>
                <div className='top'>
                <div className='user'>
                    <img src={chattingWith.img} />
                    <div className='texts'>
                        <span>{chattingWith.userName}</span>
                    </div>
                </div>

                <div className='icons'>
                    <img src='./phone.png'/>
                    <img src='./video.png'/>
                </div>
            </div>
                <div className='center'>
                    <div className="loading-chat-content">
                        <Loader size={10} color={"#5183fe"} loading={userChatLoading} />
                    </div>
                </div>
            </div>
        );
    }

    if (! chattingWith) {
        return (
            <div className='chat'>
                
            </div>
        );
    }

    return (
        <div className='chat'>
            <div className='top'>
                <div className='user'>
                    <img src={chattingWith.img} />
                    <div className='texts'>
                        <span>{chattingWith.userName}</span>
                    </div>
                </div>

                <div className='icons'>
                    <img src='./phone.png'/>
                    <img src='./video.png'/>
                </div>
            </div>

            <div className='center'>
                {chattingContent.length === 0 ? (
                    <div>

                    </div>
                ): (
                    chattingContent.map((message, index) => (
                        <div
                            className={`message ${message.isMine ? 'own' : ''}`} 
                            key={message.timestamp}
                        >
                            {!message.isMine && <img src={chattingWith.img} alt='Avatar' />}
                            <div className='texts'>
                                <p>{message.messageContent}</p>
                                <span>{formatDate(message.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* <div className='center'>
                <div className='message'>
                    <img src='./avatar.jpg' />
                    <div className='texts'>
                        <p>
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                            valuev
                            qweasdqwedkmaskdjlqkwjelkqwjlkadsjlasdsadasdasdasdsdsdsdasdasdsadasdasdssdasdasdasdasdasdasdasdasdsadaasdasdsadasdasdsad
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
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
                        <img src='./1219692.jpg' alt=''></img>
                        <p>
                            Lodasdjklnqwledrjkaslkdjaslkdjsalk
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
            </div> */}

            <div className='bottom'>
                <div className='icons'>
                    <img src='./img.png'/>
                    <img src='./camera.png'/>
                    <img src='./mic.png'/>
                </div>

                <input type='text'
                    value={message}
                    placeholder='Type a message...'
                    onChange={e => setMessage(e.target.value)} />
                
                 <div className='emoji'>
                    <img src='./emoji.png' onClick={() => setOpenEmoji((prev) => !prev) }/>
                    <div className='picker'>
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button className='sendButton' onClick={handleSendMessage}>

                    <FaPaperPlane/>
                </button>
            </div>
        </div>
    );
}

export default Chat;