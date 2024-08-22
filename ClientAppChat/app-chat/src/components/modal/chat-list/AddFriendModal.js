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
    handleCloseAddFriendModal
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
    const handleAccept = () => {
        // handle accept logic
    };

    const handleDecline = () => {
        // handle decline logic
    };


    // adding new friend
    const handleAddFriend = (friendEmail) => {
        if (mode === 'addFriend') {
            const handleGetUserInfo = async () => {
                
                try {
                    
                    await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/send-friend-request`, null, {
                        params: {
                            senderEmail: email,
                            recipientEmail: friendEmail
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
        
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Having error when call api',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    setFetchData(prev => !prev);
                }
            };

            handleGetUserInfo();
        }
    }

    // cancel request 
    const handleCancelRequest = async (friendEmail) => {
        if (mode === 'addFriend') {
            try {
                // Gửi request tới API
                await axios.post(`http://${BACKEND_URL_HTTP}/api/friend-controller/cancel-friend-request`, null, {
                    params: {
                        senderEmail: email,
                        recipientEmail: friendEmail
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
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
                                    <img src={request.image} alt="request-img" className="request-img" />
                                    <div className="request-info">
                                        <h4>{request.name}</h4>
                                        <p>{request.email}</p>
                                    </div>
                                    <div className="request-actions">
                                        <button className="accept-btn" onClick={() => handleAccept(request.id)}>
                                            <FaCheck />
                                            Accept
                                        </button>
                                        <button className="decline-btn" onClick={() => handleDecline(request.id)}>
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
