import React, { useState } from 'react';
import './details.css';
import { FaExclamationTriangle, FaUserMinus } from 'react-icons/fa';
import Loader from "react-spinners/SyncLoader";
import { BACKEND_URL_HTTP } from '../../config.js';
import axios from 'axios';
import Modal from '../modal/Modal.js';
import ModalHeader from '../modal/ModalHeader.js'
import ModalFooter from '../modal/ModalFooter.js'
import UpdateImage from '../modal/chat-list/UpdateImage.js'
import UserBasicInfo from '../modal/chat-list/UserBasicInfo.js';
import Swal from 'sweetalert2';

function Details({ loadingUser, chattingWith }) {
    const [userModal, setUserModal] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState('');
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const handcloseUserModal = () => {
        setUserModal(false);
    }

    const handleOpenUserModal = () => {
        setUserModal(true);
        handleGetUserInfo();
    }

    const handleGetUserInfo = async () => {
        try {
            const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/mark-up/user-info/details-id`, {
                params: {
                    id: chattingWith.userId
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCurrentUserInfo({
                userName: response.data.userName,
                img: response.data.img,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                gender: response.data.gender,
                dob: response.data.dob
            })

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Having error when call api',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }


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
                    <img
                        className='add-group user'
                        src='./profile-user.png'
                        alt='User Info'
                        onClick={handleOpenUserModal}
                    />
                    <img className='add-group' src='./add-group.png' alt='Add Group' />
                    <FaUserMinus className='delete-friend'></FaUserMinus>
                </div>
            </div>

            
            <div className='user-chatting-details'>
                <div className='report-content'>
                    <FaExclamationTriangle/> Report This User
                </div>
            </div>
            {userModal && (
                <Modal
                    show={userModal}
                    header={<ModalHeader
                        title='User Info'
                        onClose={handcloseUserModal} />}
                >
                        <div className={`modal-content update}`}>
                        <UserBasicInfo
                                    userInfo={currentUserInfo}
                                    setUserInfo={setCurrentUserInfo}
                                />
                        </div>
                </Modal>
            )}
        </div>
    );
}

export default Details;