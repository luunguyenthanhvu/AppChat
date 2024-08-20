import React from 'react';
import Modal from '../Modal.js'; // Assuming you have a Modal component
import { FaTimes, FaUserPlus } from 'react-icons/fa';

const AddFriendModal = ({ addFriendModal, handleCloseAddFriendModal, friendList }) => {
    return (
        <Modal
            show={addFriendModal}
            header={
                <div className="modal-header">
                    <input
                        type="text"
                        placeholder="Search for friends..."
                        className="search-input"
                    />
                    <button className="modal-close" onClick={handleCloseAddFriendModal}>
                        <FaTimes />
                    </button>
                </div>
            }
        >
            <div className="friend-list">
                {friendList.map((friend, index) => (
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
        </Modal>
    )
};

export default AddFriendModal;
