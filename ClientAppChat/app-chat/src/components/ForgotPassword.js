import React, {createContext, useState, useContext } from 'react';
import { FaEnvelope} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import '../css/Loading.css';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../config.js';
import imgHolder from '../img/login-holder.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isEmail, setIsEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const AuthContext = createContext();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    const verifyHandler = async (e) => {
        e.preventDefault();
        let timerInterval;
        if (!validateEmail(email)) {
            Swal.fire({
                title: 'The email is not properly formatted. Please re-type !',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            })
        } else {

            setIsLoading(true); // Bắt đầu hiển thị loading spinner
            try {
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/ForgotPassword?email=${encodeURIComponent(email)}`);
                console.log(response);
                setIsLoading(false); // Ẩn loading spinner

                if(response.status === 200 && response.data.message === "Email này không đăng ký trên hệ thống. Vui lòng nhập lại email của bạn"){
                    Swal.fire({
                        title: 'Password Retrieval Failed!',
                        text: 'This email is not on our system. Please re-enter your email.',
                        icon: 'error',
                        confirmButtonColor: "#3085d6",
                    })
                   
                    
                }
                if(response.status === 200 && response.data.message === "Hệ thống đã gửi mật khẩu mới vào email của bạn. Vui lòng kiểm tra thư của bạn"){
                    Swal.fire({
                        title: 'Password retrieval successful!',
                        text: 'The new password has been sent to your email. Please check your mail',
                        icon: 'success',
                        confirmButtonColor: "#3085d6",
                    }).then(() => {
                        
                        navigate('/')
                    });
                   
                    
                }
             
                
            } catch (error) {
                setIsLoading(false); // Ẩn loading spinner
                console.error('Login error:', error);
                // Xử lý lỗi khi xác thực
                Swal.fire({
                    title: 'Password Retrieval Failed!',
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
                <h2>Get your password back </h2>
                <form onSubmit={verifyHandler}>
                    <div className={`form-group ${isEmail ? 'focused' : ''}`}>
                        <label>
                            <FaEnvelope/> 
                        </label>
                        <input
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsEmail(true)}
                            onBlur={() => setIsEmail(false)}
                            placeholder='Email'
                        />
                    </div>
                   

                    <button className='login-btn' type='submit'>
                       GET THE PASSWORD
                    </button>

                   
                </form>
            </div>
            </div>
            </div>
        </div>
    );
}
export default ForgotPassword;