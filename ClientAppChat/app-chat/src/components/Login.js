import React, {createContext, useState, useContext } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import { BACKEND_URL_HTTP, BACKEND_URL_HTTPS } from '../config.js';
import imgHolder from '../img/login-holder.jpg';
import iconGoogle from '../img/google-icon.png';
import iconFaceBook from '../img/facebook.png';
import iconTwitter from '../img/twitter-logo.jpg'; 
import Swal from 'sweetalert2';
import axios from 'axios';

import { GoogleLogin } from '@react-oauth/google';

const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Xử lý logic sau khi đăng nhập thành công, ví dụ gửi token đến server.
    fetch('http://localhost:5133/api/account/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: credentialResponse.credential,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Lưu JWT hoặc thực hiện các bước tiếp theo
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
};

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const AuthContext = createContext();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        let timerInterval;
        if (username.length === 0 || password.length === 0) {
            Swal.fire({
                title: 'Please fill in all fields',
                icon: 'warning',
                confirmButtonColor: "#3085d6",
            });
            return;
        }
        if (!validateEmail(username)) {
            Swal.fire({
                title: 'Email is not valid!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            })
        } else {

            try {
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/chat/login`, {
                    email: username,
                    password : password
                });

                    // Giả sử token và các thông tin khác nằm trong response.data
                const { userName, email, img, token } = response.data;

                localStorage.setItem('userName', userName);
                localStorage.setItem('email', email);
                localStorage.setItem('img', img);
                localStorage.setItem('token', token);
                console.log(response.data);
                // response OK
                Swal.fire({
                    title: "Login into account",
                    html: "I will close in <b></b> milliseconds.",
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                    }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                        navigate('/chat')
                    }
                    });
                
            } catch (error) {
                console.error('Login error:', error);
                // Xử lý lỗi khi đăng nhập
            }
        }
    }
    return (
        <div className="background-image">
            <div className='overlay'>
            <div className='main-container content'>
            <div className='img-container'>
                <img src={imgHolder} alt='Login img holder'></img>
            </div>
            <div className="login-container">
                <h2>Login into account</h2>
                <form onSubmit={loginHandler}>
                    <div className={`form-group ${isUsernameFocused ? 'focused' : ''}`}>
                        <label>
                            <FaEnvelope/> 
                        </label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                            placeholder='Email address'
                        />
                    </div>
                    <div className={`form-group ${isPasswordFocused ? 'focused' : ''}`}>
                        <label>
                            <FaLock/>
                        </label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            placeholder='Password'
                        />
                    </div>

                    <button className='login-btn' type='submit'>
                        LOGIN
                    </button>

                    <div className='forget-pass'>
                        <a href=''>
                            Forget Password?
                        </a>
                    </div>

                    <div>
                        or login with
                    </div>

                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                    />

                    <div className='login-option'>
                        <a href='' className='icon-login'>
                            <img src={iconGoogle}></img>
                        </a>
                        <a href='' className='icon-login'>
                            <img src={iconFaceBook}></img>
                        </a>
                        <a href='' className='icon-login'>
                            <img src={iconTwitter}></img>
                        </a>
                    </div>

                    <div className='break-line'></div>

                    <div className='register-here'>
                        Don't have an account? 
                        <a href=''>
                            Register here
                        </a>
                    </div>
                </form>
            </div>
            </div>
            </div>
        </div>
    );
}
export default Login;