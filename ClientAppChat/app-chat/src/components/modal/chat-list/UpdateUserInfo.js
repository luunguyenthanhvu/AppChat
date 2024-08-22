import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const UpdateUserInfo = ({ userInfo, setUserInfo, viewType, setViewType, password, setPassword }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        gender: '',
        dateOfBirth: ''
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Function to convert date from "dd/MM/yyyy" to "yyyy-MM-dd"
    const convertDateToISO = (dob) => {
        const [day, month, year] = dob.split('/');
        return `${year}-${month}-${day}`;
    };

    // Function to convert date from "yyyy-MM-dd" to "dd/MM/yyyy"
    const convertDateToCustomFormat = (isoDate) => {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (userInfo) {
            setFormData({
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                userName: userInfo.userName || '',
                gender: userInfo.gender || '',
                dateOfBirth: userInfo.dob ? convertDateToISO(userInfo.dob) : ''
            });
        }
    }, [userInfo]);

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedFormData);

        // Update userInfo only after all fields have been processed
        if (name === 'dateOfBirth') {
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                dob: convertDateToCustomFormat(value),
            }));
            console.log("ngay thang sau khi dc chon")
            console.log(convertDateToCustomFormat(value))
        } else {
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                [name]: value,
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        const passData = {
            ...passwordData,
            [name]: value
        }
        setPasswordData(passData);
        setPassword(passData);
    };

    return (
        <div className='user-modal-info'>
            <div className='user-main-info'>
                <h2>{viewType === 'personal' ? 'Update Personal Information' : 'Update Password'}</h2>

                {viewType === 'personal' ? (
                    <form>
                        <div className='my-form-group'>
                            <label htmlFor='firstName'>First Name:</label>
                            <input
                                type='text'
                                id='firstName'
                                name='firstName'
                                value={formData.firstName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className='my-form-group'>
                            <label htmlFor='lastName'>Last Name:</label>
                            <input
                                type='text'
                                id='lastName'
                                name='lastName'
                                value={formData.lastName}
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
                    <FaExchangeAlt className='update-icon'/>
                    {viewType === 'personal' ? 'Update Password' : 'Update Personal Information'}
                </button>
            </div>
        </div>
    );
};

export default UpdateUserInfo;
