import React, { useState } from 'react';
import Modal from '../Modal.js'; // Assuming you have a Modal component
import { FaTimes, FaSearch, FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import './AddFriendModal.css';

const AddFriendModal = ({ showModal, handleCloseModal, friendList, friendRequests, handleAcceptRequest, handleRejectRequest }) => {
    // Khai báo state cho activeTab
    const [activeTab, setActiveTab] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFriends = friendList.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Modal
            className='add-friend-modal'
            show={showModal}
            title="Friends"
            header={
                <div className='modal-header-container'>
                    <h2>Friends</h2>
                    <button className="modal-close" onClick={handleCloseModal}>
                        <FaTimes />
                    </button>
                </div>
            }
        >
            <div className="modal-body">
                <div className="searchBar">
                    <FaSearch />
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="content-tabs">
                    <div 
                        className={`tab ${activeTab === 'search' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('search')}
                    >
                        Search
                    </div>
                    <div 
                        className={`tab ${activeTab === 'requests' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('requests')}
                    >
                        Requests
                    </div>
                </div>
                {activeTab === 'search' && (
                    <div className="friend-list">
                        {filteredFriends.map((friend, index) => (
                            <div key={index} className="friend-item">
                                <img src={friend.image} alt="friend-img" className="friend-img" />
                                <div className="friend-info">
                                    <h4>{friend.name}</h4>
                                    <p>{friend.email}</p>
                                </div>
                                <button className="add-friend-btn">
                                    <FaUserPlus />
                                    Add Friend
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'requests' && (
                    <div className="request-list">
                        {friendRequests.map((request, index) => (
                            <div key={index} className="request-item">
                                <img src={request.image} alt="request-img" className="request-img" />
                                <div className="request-info">
                                    <h4>{request.name}</h4>
                                    <p>{request.email}</p>
                                </div>
                                <div className="request-actions">
                                    <button className="accept-btn" onClick={() => handleAcceptRequest(request.id)}>
                                        <FaUserCheck />
                                        Accept
                                    </button>
                                    <button className="reject-btn" onClick={() => handleRejectRequest(request.id)}>
                                        <FaUserTimes />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddFriendModal;
