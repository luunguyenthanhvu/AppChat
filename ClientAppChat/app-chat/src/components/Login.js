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
import { Link } from 'react-router-dom';


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
            });
        } else {
            try {
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login`, {
                    email: username,
                    password: password
                });

                if (response.status === 200) {
                    if (response.data.message) {
                        Swal.fire({
                            title: 'Login failed!',
                            text: response.data.message,
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        const { userName, email, img, role, token, isAdmin, status } = response.data;

                        if (status === "Blocked") {
                            // Hiển thị thông báo tài khoản bị khóa với kiểu bạn mong muốn
                            Swal.fire({
                                title: "Custom width, padding, color, background.",
                                width: 600,
                                padding: "3em",
                                color: "#716add",
                                background: "#fff url(/images/trees.png)",
                                backdrop: `
                                rgba(0,0,123,0.4)
                                url("/images/nyan-cat.gif")
                                left top
                                no-repeat
                              `
                            });
                        } else {
                            // Lưu thông tin vào localStorage và điều hướng dựa trên isAdmin
                            localStorage.setItem('userName', userName);
                            localStorage.setItem('email', email);
                            localStorage.setItem('img', img);
                            localStorage.setItem('token', token);

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
                                    if (isAdmin) {
                                        navigate('/admin');
                                    } else {
                                        navigate('/chat');
                                    }
                                }
                            });
                        }
                    }
                } else if (response.status === 400) {
                    Swal.fire({
                        title: "Custom width, padding, color, background.",
                        width: 600,
                        padding: "3em",
                        color: "#716add",
                        background: "#fff url(/images/trees.png)",
                        backdrop: `
                        rgba(0,0,123,0.4)
                        url("/images/nyan-cat.gif")
                        left top
                        no-repeat
                      `
                    });
                }


            } catch (error) {
                console.error('Login error:', error);
                Swal.fire({
                    title: "Your account has been blocked",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                    background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
                    backdrop: `
                        rgba(0,0,123,0.4)
                       url("https://sweetalert2.github.io/images/nyan-cat.gif")
                        left top
                        no-repeat
                      `
                });
            }
        }
    };

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
                    <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <div>
                        hoặc đăng nhập bằng
                    </div>

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
                          <Link to="/register">Register here</Link>
                    </div>
                </form>
            </div>
            </div>
            </div>
        </div>
    );
}
export default Login;