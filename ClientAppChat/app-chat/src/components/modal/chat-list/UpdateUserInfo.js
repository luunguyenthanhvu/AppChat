import React, { useState } from 'react';
import { FaExchangeAlt  } from 'react-icons/fa';
const UpdateUserInfo = ({ userInfo, onSave }) => {
    // State to manage form data for personal information
    const [formData, setFormData] = useState({
        userName: '',
        gender: '',
        dateOfBirth: ''
    });

    // State to manage view type (personal or password update)
    const [viewType, setViewType] = useState('personal'); // 'personal' or 'password'

    // State to manage form data for password update
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Handle change for personal information form
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle change for password update form
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    // Handle save action
    // const handleSave = () => {
    //     if (viewType === 'personal') {
    //         if (onSave) {
    //             onSave(formData);
    //         }
    //     } else if (viewType === 'password') {
    //         if (onSave) {
    //             onSave(passwordData);
    //         }
    //     }
    // };

    return (
        <div className='user-modal-info'>
            <div className='user-main-info'>
                <h2>{viewType === 'personal' ? 'Update Personal Information' : 'Update Password'}</h2>
                
                {viewType === 'personal' ? (
                    <form>
                        <div className='my-form-group'>
                            <label htmlFor='userFirstName'>First Name:</label>
                            <input
                                type='text'
                                id='userFirstName'
                                name='userFirstName'
                                value={formData.userName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='userLastName'>Last Name:</label>
                            <input
                                type='text'
                                id='userLastName'
                                name='userLastName'
                                value={formData.userName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='userName'>User Name:</label>
                            <input
                                type='text'
                                id='userName'
                                name='userName'
                                value={formData.userName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='gender'>Gender:</label>
                            <select
                                id='gender'
                                name='gender'
                                value={formData.gender}
                                onChange={handlePersonalChange}
                            >
                                <option value=''>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </select>
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='dateOfBirth'>Date of Birth:</label>
                            <input
                                type='date'
                                id='dateOfBirth'
                                name='dateOfBirth'
                                value={formData.dateOfBirth}
                                onChange={handlePersonalChange}
                            />
                        </div>
                    </form>
                ) : (
                    <form>
                        <div className='my-form-group'>
                            <label htmlFor='newPassword'>New Password:</label>
                            <input
                                type='password'
                                id='newPassword'
                                name='newPassword'
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='confirmPassword'>Confirm Password:</label>
                            <input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </form>
                )}

                <button className='my-switch-button' onClick={() => setViewType(viewType === 'personal' ? 'password' : 'personal')}>
                    <FaExchangeAlt  className='update-icon'/>
                    {viewType === 'personal' ? 'Update Password' : 'Update Personal Information'}
                </button>
            </div>
        </div>
    );
};

export default UpdateUserInfo;
