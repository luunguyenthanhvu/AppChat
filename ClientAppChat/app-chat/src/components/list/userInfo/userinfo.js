import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userinfo.css';
import {FaEllipsisH,FaSave, FaVideo,FaSyncAlt, FaCamera, FaPenSquare, FaTimes,FaUser, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Modal from '../../modal/Modal.js';
import ModalHeader from '../../modal/ModalHeader.js'
import ModalFooter from '../../modal/ModalFooter.js'
import UpdateImage from '../../modal/chat-list/UpdateImage.js'
import UserBasicInfo from '../../modal/chat-list/UserBasicInfo.js';
import UpdateUserInfo from '../../modal/chat-list/UpdateUserInfo.js';
import { CSSTransition } from 'react-transition-group';

function UserInfo({ userInfo }) {
    const [userSetting, setUserSetting] = useState(false);

    const navigate = useNavigate();

    const handleOpenInfoUserClick = () => {
        setUserSetting(!userSetting);
    }

    const handleCloseInfoUserClick = () => {
        setUserSetting(false);
    }

    const [showModal, setShowModal] = useState(false);

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

    // update image
    const [currentTab, setCurrentTab] = useState('User Info');

    const handleCameraClick = () => {
        setCurrentTab('Update Image');
    };

    const handleUpdateUserInfo = () => {
        setCurrentTab('Update User Info');
    }

    useEffect(() => {
        setShowModal(false);
        setCurrentTab('User Info')
    }, {})

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
                <label>
                    <FaVideo/>
                </label>
                <label>
                    <FaPenSquare/>
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
                   onClose={handleCloseModalUserInfo}
                   header={<ModalHeader title={currentTab} onClose={handleCloseModalUserInfo} />}
                    footer={currentTab === 'User Info' ?
                        (
                            <ModalFooter>
                                <button onClick={handleUpdateUserInfo}>
                                    <FaSyncAlt className='icon' />
                                    Update Info
                                </button>
                            </ModalFooter>
                        ) : (
                            <ModalFooter>
                                <button>
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
                                <UpdateImage />
                            )}

                            {currentTab === 'Update User Info' && (
                                <UpdateUserInfo />
                            )}
                        </div>
                        </CSSTransition>
               </Modal>
            )}
        </div>
    );
}

export default UserInfo;