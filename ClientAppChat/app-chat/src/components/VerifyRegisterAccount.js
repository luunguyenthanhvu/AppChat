import React, {createContext, useState, useContext } from 'react';
import { FaCode} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import '../css/Loading.css';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../config.js';
import imgHolder from '../img/login-holder.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';

function VerifyRegisterAccount() {
    const navigate = useNavigate();
    const [codeVerify, setCodeVerify] = useState('');
    const [isCodeVerify, setIsCodeVerify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const AuthContext = createContext();

    const validateCodeVerify = (codeVerify) => {
        const regex = /^\d{6}$/;
        return regex.test(codeVerify);
    }


    const verifyHandler = async (e) => {
        e.preventDefault();
        let timerInterval;
        if (!validateCodeVerify(codeVerify)) {
            Swal.fire({
                title: 'The authentication code is not in the correct format. The authentication code is only 6 digits!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            })
        } else {

            setIsLoading(true); // Bắt đầu hiển thị loading spinner
            try {
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/verifyAccount`, {
                    email: localStorage.getItem("email"),
                    otp : codeVerify
                });
                console.log(response);
                setIsLoading(false); // Ẩn loading spinner

                if(response.status === 200 && response.data.message === "Tài khoản xác thực thành công."){
                    Swal.fire({
                        title: 'Validation Successful!',
                        text: 'Authentication is successful. Please log in to your account ',
                        icon: 'success',
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        
                        navigate('/')
                    });
                   
                    
                }
                if(response.status === 200 && response.data.message === "Mã xác thực không đúng. Vui lòng nhập lại."){
                    Swal.fire({
                        title: 'Validation failed!',
                        text: 'The authentication code is incorrect. Please re-type !',
                        icon: 'error',
                        confirmButtonColor: "#3085d6",
                    })
                   
                    
                }
                if(response.status === 200 && response.data.message === "Thời gian mã xác thực đã quá 30 phút. Vui lòng đăng ký lại tài khoản."){
                    Swal.fire({
                        title: 'Validation failed!',
                        text: 'The authentication code has expired. Please re-register your account!',
                        icon: 'error',
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        
                        navigate('/register')
                    });
                   
                    
                }
                
            } catch (error) {
                setIsLoading(false); // Ẩn loading spinner
                console.error('Login error:', error);
                // Xử lý lỗi khi xác thực
                Swal.fire({
                    title: 'Validation failed!',
                    text: error.response?.data?.message || 'An error occurred. Please try again!',
                    icon: 'error',
                    confirmButtonColor: "#3085d6",
                });
            }
        }
    }
    return (
        <div className="background-image">
            <div className='overlay'>
            <div className='main-container content'>
            {isLoading && (
                        <div className="loading-spinner">
                            {/* Đây là nơi bạn thêm spinner */}
                            <div className="spinner"></div>
                        </div>
                    )}
            <div className='img-container'>
                <img src={imgHolder} alt='Login img holder'></img>
            </div>
            <div className="login-container">
                <h2>Account Verificationn</h2>
                <form onSubmit={verifyHandler}>
                    <div className={`form-group ${isCodeVerify ? 'focused' : ''}`}>
                        <label>
                            <FaCode/> 
                        </label>
                        <input
                            type='text'
                            value={codeVerify}
                            onChange={(e) => setCodeVerify(e.target.value)}
                            onFocus={() => setIsCodeVerify(true)}
                            onBlur={() => setIsCodeVerify(false)}
                            placeholder='Code'
                        />
                    </div>
                   

                    <button className='login-btn' type='submit'>
                        VERIFY
                    </button>

                   
                </form>
            </div>
            </div>
            </div>
        </div>
    );
}
export default VerifyRegisterAccount;