import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './userinfo.css';
import { FaEllipsisH, FaSave, FaVideo, FaSyncAlt, FaUserPlus, FaUserFriends, FaCamera, FaPenSquare, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Modal from '../../modal/Modal.js';
import ModalHeader from '../../modal/ModalHeader.js'
import ModalFooter from '../../modal/ModalFooter.js'
import UpdateImage from '../../modal/chat-list/UpdateImage.js'
import UserBasicInfo from '../../modal/chat-list/UserBasicInfo.js';
import UpdateUserInfo from '../../modal/chat-list/UpdateUserInfo.js';
import { CSSTransition } from 'react-transition-group';
import AddFriendModal from '../../modal/chat-list/AddFriendModal.js'
import { BACKEND_URL_HTTP } from '../../../config.js';
import axios from 'axios';

function UserInfo({ userInfo, updateProfile }) {
    const [userSetting, setUserSetting] = useState(false);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const handleOpenInfoUserClick = () => {
        setUserSetting(prev => !prev);
    }

    const handleCloseInfoUserClick = () => {
        setUserSetting(false);
    }

    const handleOpenModalUserInfo = () => {
        if (userSetting) {
            setUserSetting(false);
        }
        setShowModal(true);
    }

    const handleCloseModalUserInfo = () => {
        setShowModal(false);
        setCurrentTab('User Info')
    }

    const [currentTab, setCurrentTab] = useState('User Info');
    const [imageFile, setImageFile] = useState('');

    const handleCameraClick = () => {
        setCurrentTab('Update Image');
    };

    const handleUpdateUserInfoTab = () => {
        setCurrentTab('Update User Info');
    }

    useEffect(() => {
        setShowModal(false);
        setCurrentTab('User Info')
    }, [])

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const handleUpdateUserInfo = async () => {
        Swal.fire({
            title: 'Updating...',
            text: 'Please wait...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 2000, 
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        if (currentTab === 'Update Image' && imageFile) {
            try {
                await delay(2000);

                const response = await axios.put(`http://${BACKEND_URL_HTTP}/api/mark-up/user-info/update-image`, {
                    email: email,
                    imageUrl: imageFile
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            
                Swal.fire({
                    title: 'Update successful!',
                    text: response.data,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                
                setImageFile('');
                updateProfile(email, false, false);
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Having error when update.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
        setShowModal(false);
        setCurrentTab('User Info')
    }

    const [modalContent, setModalContent] = useState('default');
    const handleLogout = () => {
        let timerInterval;
        Swal.fire({
            title: "Do you want to log out?",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: "No!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Log out of account",
                    html: "I will close in <b></b> milliseconds.",
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        localStorage.clear();
                        navigate('/login');
                    }
                });
            }
        })
    }

    const [addFriendModal, setAddFriendModal] = useState(false);
    const handleAddFriendClick = () => {
        setAddFriendModal(prev => !prev);
    }

    const handleCloseAddFriendModal = () => {
        setAddFriendModal(false);
    }

    const mockFriendList = [
        {
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            name: 'John Doe',
            email: 'john.doe@example.com'
        },
        {
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
        },
        {
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
            name: 'Michael Johnson',
            email: 'michael.johnson@example.com'
        }
    ];

    return (
        <div className='userInfo'>
            <div className='user'>
                <img src={userInfo.img} alt="User profile"/>
                <h2>{userInfo.userName}</h2>
            </div>

            <div className='icons'>
                <label onClick={handleOpenInfoUserClick}>
                    <FaEllipsisH/>
                </label>
                <label onClick={handleAddFriendClick}>
                    <FaUserPlus/>
                </label>
                <label>
                    <FaUserFriends/>
                </label>
            </div>

            {userSetting && (
                <div className="my-modal" style={{ top: '50%', left: '50%' }}>
                    <div className="my-modal-content">
                        <div className='header-my-modal-content'>
                            <h2>{userInfo.userName}</h2>
                            <FaTimes onClick={handleCloseInfoUserClick} className='close-my-modal'/>
                        </div>
                        <ul>
                            <li onClick={handleOpenModalUserInfo}>
                                <label>
                                    <FaUser style={{margin: ' 0px 5px'}}/>
                                    User Info   
                                </label>
                            </li>
                            <li onClick={handleLogout}>
                                <label>
                                    <FaSignOutAlt style={{margin: ' 0px 5px'}}/>
                                    Logout
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {showModal && (
                <Modal
                    show={showModal}
                    header={<ModalHeader title={currentTab} onClose={handleCloseModalUserInfo} />}
                    footer={currentTab === 'User Info' ? (
                        <ModalFooter>
                            <button onClick={handleUpdateUserInfoTab}>
                                <FaSyncAlt className='icon' />
                                Update Info
                            </button>
                        </ModalFooter>
                    ) : (
                        <ModalFooter>
                            <button onClick={handleUpdateUserInfo}>
                                <FaSave className='icon' />
                                Save Update
                            </button>
                        </ModalFooter>
                    )}
                >
                    <CSSTransition
                        in={modalContent === 'default'}
                        timeout={500}
                        classNames="slide"
                        unmountOnExit
                    >
                        <div className={`modal-content ${currentTab === 'update' ? 'slide-right' : ''}`}>
                            {currentTab === 'User Info' && (
                                <UserBasicInfo userInfo={userInfo} onCameraClick={handleCameraClick} />
                            )}

                            {currentTab === 'Update Image' && (
                                <UpdateImage setImageFile={setImageFile} />
                            )}

                            {currentTab === 'Update User Info' && (
                                <UpdateUserInfo />
                            )}
                        </div>
                    </CSSTransition>
                </Modal>
            )}

            {addFriendModal && (
                <AddFriendModal
                    addFriendModal={addFriendModal}
                    handleCloseAddFriendModal={handleCloseAddFriendModal}
                    friendList={mockFriendList}
                />
            )}
        </div>
    );
}

export default UserInfo;
