import React, {createContext, useState, useContext} from 'react';
import {FaEnvelope, FaLock, FaSignInAlt} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import '../css/login.css';
import {BACKEND_URL_HTTP, BACKEND_URL_HTTPS} from '../config.js';
import imgHolder from '../img/login-holder.jpg';
import iconGoogle from '../img/google-icon.png';
import iconFaceBook from '../img/facebook.png';
import iconTwitter from '../img/twitter-logo.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';

import {Link} from 'react-router-dom';

import {GoogleLogin} from '@react-oauth/google';

const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // gửi token của gg đến api để lấy ra email và username

    fetch('http://localhost:5133/api/LoginGoogle/decode-token-google', {
        // fetch(`http://${BACKEND_URL_HTTP}/api/LoginGoogle/decode-token-google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            credentialResponse.credential
        ),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const email = data.email;
            const username = data.username;
            console.log('Email:', email);
            console.log('Username:', username);
            // gọi tiếp api: http://localhost:5133/api/LoginGoogle/google-login-response-dto
            // và truyền vào dto gồm email và username
            fetch('http://localhost:5133/api/LoginGoogle/google-login-response-dto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        email: email,
                        username: username
                    }
                ),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // LoginResponseDTO
                    // chuyển hướng vào app

                })
                .catch((error) => {
                    console.error('Error:', error);
                });

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
                const response = await axios.post(`http://${BACKEND_URL_HTTP}/api/UserServices/login`, {
                    email: username,
                    password: password
                });

                // Giả sử token và các thông tin khác nằm trong response.data
                const {userName, email, img, token} = response.data;

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

                if (response.status === 200) {


                    if (response.data.message === "Tài khoản này chưa đăng ký hệ thống. Vui lòng nhập lại tài khoản email.") {
                        Swal.fire({
                            title: 'Login failed!',
                            text: 'This account is not registered in the system. Please re-type your email account.',
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                    } else if (response.data.message === "Tài khoản hoặc mật khẩu không chính xác. Xin vui lòng nhập lại") {
                        Swal.fire({
                            title: 'Login failed!',
                            text: 'Incorrect account or password. Please re-type.',
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                    } else if (response.data.message === "Tài khoản này chưa được xác minh. Xin vui lòng đăng ký lại để xác minh") {
                        Swal.fire({
                            title: 'Login failed!',
                            text: 'This account is not verified. Please register again to verify.',
                            icon: 'error',
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        // Giả sử token và các thông tin khác nằm trong response.data
                        const {userName, email, img, role, token} = response.data;

                        localStorage.setItem('userName', userName);
                        localStorage.setItem('email', email);
                        localStorage.setItem('img', img);
                        localStorage.setItem('token', token);
                        localStorage.setItem('role', role)
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
                                if (localStorage.getItem('role') === 'admin') {
                                    navigate('/admin');
                                } else {
                                    navigate('/chat');
                                }


                            }
                        });
                    }
                }


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
                {/*</form>*/}
            </div>
            {/*</div>*/}
            {/*</div>*/}
        </div>
    )
        ;
}

export default Login;