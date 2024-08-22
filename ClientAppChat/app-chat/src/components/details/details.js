import React, { useState } from 'react';
import './details.css';
import { FaExclamationTriangle, FaUserMinus } from 'react-icons/fa';
import Loader from "react-spinners/SyncLoader";
import { BACKEND_URL_HTTP } from '../../config.js';
import axios from 'axios';
import Modal from '../modal/Modal.js';
import ModalHeader from '../modal/ModalHeader.js';
import Swal from 'sweetalert2';
import UserBasicInfo from '../modal/chat-list/UserBasicInfo.js';

function Details({ loadingUser, chattingWith, updateChatListWithId }) {
    const [userModal, setUserModal] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState('');
    const [reportModal, setReportModal] = useState(false); // State to manage report modal
    const [reportReason, setReportReason] = useState(''); // State to manage the report reason
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const handcloseUserModal = () => {
        setUserModal(false);
    }

    const handleOpenUserModal = () => {
        setUserModal(true);
        handleGetUserInfo();
    }
    console.log('usser u chat with')
    console.log(JSON.stringify(chattingWith))
    const deleteFriend = async () => {
        try {
          // Hiển thị cảnh báo xác nhận
          const result = await Swal.fire({
            title: 'Are you sure you want to delete this friend??',
            text: "This action cannot be undone.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel'
          });
    
          if (result.isConfirmed) {
            // Gửi yêu cầu xóa đến API
            await axios.delete(`http://${BACKEND_URL_HTTP}/api/friend-controller/delete-friend`, {
                params: {
                    userEmail: email,
                    friendId: chattingWith.userId
                }
            });
            
            Swal.fire(
              'Deleted!',
              'You have successfully deleted this friend..',
              'success'
            );
    
            updateChatListWithId(email, chattingWith.userId)
          }
        } catch (error) {
            console.log(error)
          Swal.fire(
            'Error!',
            'error'
          );
        }
      };

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
            });

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Having error when call api',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    const handleOpenReportModal = () => {
        setReportModal(true);
    }

    const handleCloseReportModal = () => {
        setReportModal(false);
        setReportReason(''); // Clear reason when modal is closed
    }

    const handleSubmitReport = async () => {
        if (!reportReason) {
            Swal.fire({
                title: 'Error!',
                text: 'Please enter a reason for reporting.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const reportPayload = {
                ReportedUserId: chattingWith.userId, // ID of the reported user
                Reason: reportReason,
            };

            await axios.put(`http://${BACKEND_URL_HTTP}/api/User/report-user`, reportPayload, config);

            Swal.fire({
                title: 'Success!',
                text: 'User reported successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            handleCloseReportModal(); // Close the modal after successful report
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while reporting the user.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

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
                <img src={chattingWith.img} alt='User' />
            </div>
    
            <div className='user-chatting-details'>
                <h2>{chattingWith.userName}</h2>
            </div>
    
            {chattingWith.userName === 'Yukihira' ? (
                <div className='admin-text'>
                    <p>This is an admin</p>
                    <p>If you have any questions about our application, you can message the admin.</p>
                </div>
            ) : (
                <>
                    <div className='user-chatting-details'>
                        <div className='icons'>
                            <img
                                className='add-group user'
                                src='./profile-user.png'
                                alt='User Info'
                                onClick={handleOpenUserModal}
                            />
                            <img className='add-group' src='./add-group.png' alt='Add Group' />
                            <FaUserMinus
                                className='delete-friend'
                                onClick={deleteFriend}
                            />
                        </div>
                    </div>
    
                    <div className='user-chatting-details'>
                        <div className='report-content' onClick={handleOpenReportModal}>
                            <FaExclamationTriangle /> Report This User
                        </div>
                    </div>
                </>
            )}
    
            {userModal && (
                <Modal
                    show={userModal}
                    header={<ModalHeader
                        title='User Info'
                        onClose={handcloseUserModal} />}
                >
                    <div className={`modal-content update`}>
                        <UserBasicInfo
                            userInfo={currentUserInfo}
                            setUserInfo={setCurrentUserInfo}
                        />
                    </div>
                </Modal>
            )}
            {/* Report Modal */}
            {reportModal && (
                <Modal
                    show={reportModal}
                    header={<ModalHeader title='Report User' onClose={handleCloseReportModal} />}
                >
                    <div className="modal-content">
                        <div className="report-reason">
                            <label>Enter Reason for Reporting:</label>
                            <input
                                type="text"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Reason"
                            />
                        </div>
                        <div className="report-actions">
                            <button onClick={handleSubmitReport} className="submit-reason-button">
                                Submit Reason
                            </button>
                            <button onClick={handleCloseReportModal} className="cancel-reason-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
    
    
}

export default Details;
