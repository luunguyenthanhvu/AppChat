import React, { useRef, useState ,useEffect } from 'react';
import { FaPaperPlane} from 'react-icons/fa';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import Loader from "react-spinners/SyncLoader";
import { formatDistanceToNow } from 'date-fns';
import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../../config.js';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageFilter from 'filepond-plugin-image-filter';

// Đăng ký các plugin
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginImageEdit,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform,
    FilePondPluginImageFilter
);

function Chat({chattingWith, loadingUser,userChatLoading, chattingContent, sendMessage}) {
    const [message, setMessage] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const handleEmoji = e => {
        setMessage(prev => prev + e.emoji);
        setOpenEmoji(false);
    }

    const chatContainerRef = useRef(null);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chattingContent,chattingWith]);

    const TEN_MINUTES = 10 * 60 * 1000;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const handleSendMessage = () => {
        if (message) {
            console.log(chattingWith)
            sendMessage(chattingWith.userId, message, false)
            setMessage('');
        } else if (imageMessage) {
            sendMessage(chattingWith.userId, imageMessage, true)
            setImageMessage('');
            setShowFilePond(false);
        }
        
    }

    // for user send to other a image
    const [imageFile, setImageFile] = useState('');
    const filePondRef = useRef(null);
    const [showFilePond, setShowFilePond] = useState(false);
    const [imageMessage, setImageMessage] = useState('');
    const handleChatImg = () => {
        document.getElementById('imageFileInput').click();
    };
    useEffect(() => {
        setImageFile('');
        setShowFilePond(false);
        setImageMessage('');
        setMessage('');
    }, [chattingWith]);
    const handleFileChange = (event) => {
        setShowFilePond(true);
        setImageFile([...event.target.files]);
    };


    const [imgList, setImgList] = useState([]);
  

    const handleProcess = async (fieldName, file, metadata, load, error, progress, abort) => {
        try {
            const signatureResponse = await axios.get(`http://${BACKEND_URL_HTTP}/api/cloudinary/get-signature`);
            //get-signature
            console.log("signature ne" + signatureResponse.data.apiKey + signatureResponse.data.signature);
            
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", signatureResponse.data.apiKey); 
            formData.append("signature", signatureResponse.data.signature);
            formData.append("timestamp", signatureResponse.data.timestamp);
            
    
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://api.cloudinary.com/v1_1/dter3mlpl/image/upload');
          
          xhr.upload.onprogress = (event) => {
            const progressPercentage = Math.round((event.loaded / event.total) * 100);
            progress(progressPercentage);
          };
    
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              const public_id = response.public_id;
              
              setImgList((prevList) => [
                ...prevList,
                {
                  publicId: response.public_id,
                  assetId: response.asset_id,
                  url: response.url
                }
              ]);
            setImageMessage(response.url);
    
              load(public_id);
            } else {
              error('Upload error');
            }
          };
    
          xhr.onerror = () => {
            error('Upload error');
          };
    
          xhr.send(formData);
    
          // Trả về một hàm để xử lý việc hủy upload
          return {
            abort: () => {
              xhr.abort();
              abort();
            }
          };
        } catch (err) {
          console.error(err);
          error('Error occurred during upload');
        }
      };
    
    const handleRevert = (source, load, error) => {
        setShowFilePond(false);
        const removeImage = async () => {
          try {
            await axios.get(`http://${BACKEND_URL_HTTP}/api/cloudinary/remove-image`, { params: { id: source } });
              setImgList((prevList) => prevList.filter((img) => img.publicId !== source));
              setImageMessage('');
            load();
          } catch (err) {
            console.error('Error removing image:', err);
            error('Error occurred during removal');
          }
        };
    
        removeImage();
    };
    const handleInputBlur = () => {
        setShowFilePond(false);
    }
    useEffect(() => {
        console.log("img ne")
        console.log(imageMessage)
    }, [imageMessage]);


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

            <div className='center' ref={chatContainerRef}>
                {chattingContent.length === 0 ? (
                    <div>

                    </div>
                ) : (
                    chattingContent.map((message, index) => {
                        // Kiểm tra xem tin nhắn trước đó có cùng người gửi không
                        const previousMessage = chattingContent[index - 1];
                        const isSameSender = previousMessage && previousMessage.senderId === message.senderId;
                        const hiddenImg = isSameSender ? 'hidden' : '';
                        const isWithinTenMinutes = previousMessage && (new Date(message.timestamp) - new Date(previousMessage.timestamp)) < TEN_MINUTES;
    
                        // Ẩn hoặc hiển thị thời gian dựa trên điều kiện
                        const showTimestamp = !(isSameSender && isWithinTenMinutes);

                        return (
                            <div
                                className={`message ${chattingWith.userId === message.receiverId ? 'own' : ''}`} 
                                key={message.MessageId}
                            >
                                {/* Chỉ hiển thị hình ảnh nếu tin nhắn trước đó không phải của cùng người gửi */}
                                {chattingWith.userId !== message.receiverId && <img src={chattingWith.img} alt='Avatar' className={hiddenImg} />}
                                <div className='texts'>
                                    {!message.isImage ?
                                        <p>{message.content}</p>
                                        :
                                        <img
                                            src={message.content}
                                            alt=''
                                            style={{
                                                width:'300px',
                                                maxWidth: '400px', 
                                                height: 'auto',
                                                objectFit: 'cover' 
                                            }}  
                                        />}
                                    {(showTimestamp) && <span>{formatDate(message.timestamp)}</span>}
                                </div>
                            </div>
                        );
                    })                    
                )}
            </div>
             {showFilePond && (
                <FilePond
                  ref={filePondRef}
                  files={imageFile}
                  onupdatefiles={setImageFile}
                  allowMultiple={false}
                  acceptedFileTypes={['image/*']}
                  server={{
                    process: handleProcess,
                    revert: handleRevert
                  }}
                  name="files"
                  labelIdle='Input your image'
                    id='filePond'
                />
              
            )}
            <div className='bottom'>
        
                <div className='icons'>
                        <img src='./img.png' onClick={handleChatImg}/>
                        <img src='./camera.png'/>
                        <img src='./mic.png'/>
                </div>

                <input
                    type='file'
                    id='imageFileInput'
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    onBlur={handleInputBlur}
                />

                <input
                    type='text'
                    value={message}
                    placeholder='Type a message...'
                    onChange={e => setMessage(e.target.value)}
                />
            
                
                <div className='emoji'>
                    <img src='./emoji.png' onClick={() => setOpenEmoji(prev => !prev)} alt='Emoji Icon' />
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