import React, { useState } from 'react';

const UpdateUserInfo = ({ userInfo, onSave }) => {
    // Sử dụng state để quản lý giá trị của các ô input
    // const [formData, setFormData] = useState({
    //     userName: userInfo.userName || '',
    //     gender: userInfo.gender || '',
    //     dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] : ''
    // });
    const [formData, setFormData] = useState({
        userName:  '',
        gender:  '',
        dateOfBirth:  ''
    });

    // Hàm xử lý khi giá trị của các ô input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm xử lý khi lưu thông tin
    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
    };

    return (
        <div className='user-modal-info'>
            <div className='user-main-info'>
                <h2>Update Personal Information</h2>
                <form>
                    <div className='my-form-group'>
                        <label htmlFor='userName'>User Name:</label>
                        <input
                            type='text'
                            id='userName'
                            name='userName'
                            value={formData.userName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='my-form-group'>
                        <label htmlFor='gender'>Gender:</label>
                        <select
                            id='gender'
                            name='gender'
                            value={formData.gender}
                            onChange={handleChange}
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
                            onChange={handleChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserInfo;
