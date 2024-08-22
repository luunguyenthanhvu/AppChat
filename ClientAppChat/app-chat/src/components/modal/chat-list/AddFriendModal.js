import React, { useState, useEffect } from 'react';
import Modal from '../Modal.js'; 
import { FaTimes, FaSearch, FaUserPlus, FaCheck, FaUserTimes } from 'react-icons/fa';
import './AddFriendModal.css';
import { BACKEND_URL_HTTP } from '../../../config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from "react-spinners/SyncLoader";

const AddFriendModal = ({ 
    addFriendModal, 
    handleCloseAddFriendModal,
    updateChatList
}) => {
    const [mode, setMode] = useState('addFriend'); // 'addFriend' or 'acceptRequest'
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const isAddFriendMode = mode === 'addFriend';
    const [friendList, setFriendList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    
    const handleAccept = async (friendEmail) => {
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/accept-friend-request`, 
            {
                senderEmail: friendEmail,
                recipientEmail: email
            });
            console.log(response.data);
            updateChatList(email, friendEmail)
            // Hiển thị thông báo thành công ở góc phải màn hình
            Swal.fire({
                title: 'Success!',
                text: 'Friend request accept successfully.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            // Optionally, trigger a re-fetch of your friend list here
        } catch (error) {
            console.error('Error sending friend request:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while sending the friend request.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
        } finally {
            setFetchData(prev => !prev);
        }
    };

    const handleDecline = async (friendEmail) => {
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/decline-friend-request`, 
            {
                senderEmail: friendEmail,
                recipientEmail: email
            });
            console.log(response.data);
            
            // Hiển thị thông báo thành công ở góc phải màn hình
            Swal.fire({
                title: 'Success!',
                text: 'Friend request decline successfully.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            // Optionally, trigger a re-fetch of your friend list here
        } catch (error) {
            console.error('Error sending friend request:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while sending the friend request.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
        } finally {
            // Cập nhật dữ liệu sau khi gọi API
            setFetchData(prev => !prev);
        }
    };


    // adding new friend

    const handleAddFriend = async (friendEmail) => {
        try {
            const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/send-friend-request`, 
            {
                senderEmail: email,
                recipientEmail: friendEmail
            });
            console.log(response.data);
            updateChatList(email, friendEmail)
            Swal.fire({
                title: 'Success!',
                text: 'Friend request sent successfully.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
        } catch (error) {
            console.error('Error sending friend request:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response.data || 'An error occurred while sending the friend request.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
        } finally {
            setFetchData(prev => !prev);
        }
    };
    

    // cancel request 
    const handleCancelRequest = async (friendEmail) => {
            try {
                // Gửi request tới API
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/cancel-friend-request`, 
                    {
                            senderEmail: email,
                            recipientEmail: friendEmail
                    });
                
                // Hiển thị thông báo thành công ở góc phải màn hình
            Swal.fire({
                title: 'Success!',
                text: 'Friend request cancel successfully.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
    
            } catch (error) {
                console.log("lpong cac" + error )
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while calling the API',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                // Cập nhật dữ liệu sau khi gọi API
                setFetchData(prev => !prev);
            }
    };
    

    useEffect(() => {
        if (mode === 'addFriend') {
            const handleGetUserInfo = async () => {
                setLoading(true); // Start loading
                try {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/find-potential-friends`, {
                        params: {
                            email: email,
                            username: searchUser
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(response.data)
                    setFriendList(response.data);
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Having error when call api',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    setLoading(false); // End loading
                }
            };

            handleGetUserInfo();
        } else if (mode === 'acceptRequest') {
            const handleGetUserInfo = async () => {
                setLoading(true); // Start loading
                try {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const response = await axios.get(`http://${BACKEND_URL_HTTP}/api/friend-controller/pending-friend-requests`, {
                        params: {
                            email: email
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(response.data)
                    setPendingRequests(response.data);
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Having error when call api',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    setLoading(false); // End loading
                }
            };

            handleGetUserInfo();
        }
    }, [fetchData,mode, searchUser, email, token]);

    return (
        <Modal
            className='add-friend-modal'
            show={addFriendModal}
            title={isAddFriendMode ? "Search Friends" : "Pending Friend Requests"}
            header={
                <div className='modal-header-container'>
                    <div className='header-search'>
                        <h2>{isAddFriendMode ? "Search Friends" : "Pending Friend Requests"}</h2>
                        <button className="modal-close" onClick={handleCloseAddFriendModal}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modal-header">
                        {isAddFriendMode && (
                            <div className='searchBar'>
                                <FaSearch />
                                <input
                                    type='text'
                                    placeholder='Search'
                                    value={searchUser}
                                    onChange={(e) => {
                                        setSearchUser(e.target.value)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="modal-mode-toggle">
                        <button onClick={() => setMode('addFriend')} className={isAddFriendMode ? 'active' : ''}>Add Friend</button>
                        <button onClick={() => setMode('acceptRequest')} className={!isAddFriendMode ? 'active' : ''}>Pending Requests</button>
                    </div>
                </div>
            }
        >
            <div className="modal-content">
                {loading ? (
                    <div className="loader-container">
                        <Loader color="#007bff" />
                    </div>
                ) : (
                    isAddFriendMode ? (
                        <div className="friend-list">
                            {friendList.map((friend, index) => (
                                <div key={index} className="friend-item">
                                    <img src={friend.img} alt="friend-img" className="friend-img" />
                                    <div className="friend-info">
                                        <h4>{friend.username}</h4>
                                        <p>{friend.email}</p>
                                    </div>
                                    {friend.friendStatus === null && (
                                        <button
                                            className="add-friend-btn"
                                            onClick={() => handleAddFriend(friend.email)}
                                        >
                                            <FaUserPlus />
                                            Add Friend
                                        </button>
                                    )}
                                    {friend.friendStatus === 0 && (
                                        <button
                                            className="add-friend-btn cancel-request-btn"
                                            onClick={() => handleCancelRequest(friend.email)}
                                        >
                                            <FaUserTimes />
                                            Cancel Request
                                        </button>
                                    )}

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pending-requests-list">
                            {pendingRequests.map((request, index) => (
                                <div key={index} className="request-item">
                                    <img src={request.img} alt="request-img" className="request-img" />
                                    <div className="request-info">
                                        <h4>{request.username}</h4>
                                        <p>{request.email}</p>
                                    </div>
                                    <div className="request-actions">
                                        <button className="accept-btn" onClick={() => handleAccept(request.email)}>
                                            <FaCheck />
                                            Accept
                                        </button>
                                        <button className="decline-btn" onClick={() => handleDecline(request.email)}>
                                            <FaUserTimes />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </Modal>
    );
};

export default AddFriendModal;
