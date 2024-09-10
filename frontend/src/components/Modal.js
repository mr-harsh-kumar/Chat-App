import React, { useState, useEffect } from 'react';
import './modal.css'; // Import your modal styles
import $ from 'jquery';
import {setUser, getUser} from './user.js';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginModal = ({ showModal, closeModal }) => {

    // $('.modal-content').slideDown()

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const navigate = useNavigate();
    
    const logging_in = (user) => toast(`${user} is logging in !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });


    useEffect(() => {
        if (showModal) {
            $('.modal-content').slideDown();
        } else {
            $('.modal-content').slideUp();
                setUsername('');
                setPassword('');
                setMessage('');
                setShowPassword(false);
            };
        
    }, [showModal]);

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const csrfToken = getCookie('csrftoken');

  
    const handleLogin = (e) => {
        
        e.preventDefault();

        const formData = {
            username: username,
            password: password,
            csrfmiddlewaretoken: csrfToken,
        };

        $.ajax({
            data: formData,
            url: 'http://localhost:8000/chat_app/login/',
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function(response) {
                if (response.status === 'success') {
                    setUser(response.username);
                    setMessage(response.message);
    
                    // Use React Router to navigate without reloading
                    // navigate(`/chat_app/`);
                    logging_in(username);
                    setTimeout(() => {
                        window.location.href = 'http://localhost:3000/chat_app/'
                        
                    }, 2000);
                    
                    closeModal(); 
                } else {
                    setMessage(response.message);
                }
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401) {
                    setMessage('Invalid credentials. Please try again.');
                } else {
                    setMessage('An error occurred: ' + xhr.responseText);
                }
            }
        });

       
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



   
    return (
        <>
        <ToastContainer />
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={closeModal}>
    

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeModal}>&times;</span>
                <h1 className="modal-title" style={{ fontSize: '32px', textAlign: 'center' }}>Login</h1>
                <div className="modal-body">
                    <div className="login-details" style={{ textAlign: 'center' }}>
                        <form onSubmit={handleLogin}>
                            <div>
                                Username: <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div style={{  display: 'inline-block',position: 'relative' }}>
                                Password: 
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    name="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <i id="eye-icon"
                                    className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} 
                                    onClick={togglePasswordVisibility} 
                                    style={{ 
                                        position: 'absolute', 
                                        right: '10px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)', 
                                        cursor: 'pointer' 
                                    }}
                                ></i>
                            </div>
                            <div className="modal-footer">
                                <button type="submit">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>{message}</div>
            </div>
        </div>
        </>
    );
};


const SignupModal = ({ showModal, closeModal, openLoginModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const signup = (username) => toast(`${username} is signing in !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });


    useEffect(() => {
        if (!showModal) {
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setMessage('');
            setImage(null);
            setShowPassword(false);
            $('.modal-content').slideUp();
        }

        
        if (showModal) {
            $('.modal-content').slideDown();
        }
    }, [showModal]);

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const csrfToken = getCookie('csrftoken');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Password Mismatched');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('image', image);
        formData.append('csrfmiddlewaretoken', csrfToken);

        // Log the contents of the FormData object
        for (let [key, value] of formData.entries()) {
            console.log(value);
        }

        $.ajax({
            url: 'http://localhost:8000/chat_app/signup/', // Your signup endpoint
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (response) {
                if (response.status === 'success') {
                    setMessage("Signup successful!");
                    signup(username);
                    setTimeout(() => {
                        window.location.href = 'http://localhost:3000/chat_app/';
                    }, 2000);
                } else if (response.status === 'error' && response.message === "This username is already existed") {
                    setMessage("This username already exists"); // Set message if user already exists
                }
            },
            error: function (xhr, status, error) {
                setMessage('Error occurred during signup.');
            }
        });
        
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    return (
        <>
        <ToastContainer />
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeModal}>&times;</span>
                <h1 className="modal-title" style={{ fontSize: '32px', textAlign: 'center' }}>Signup</h1>
                <div className="modal-body">
                    <div className="signup-details">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div>Username: <input type="text" name='username' value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                Password: <input type={showPassword ? 'text' : 'password'} name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <i id="eye-icon"
                                    className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                ></i>
                            </div>
                            <div style={{ display: 'inline-block', position: 'relative' }}>
                                Confirm Password: <input type={showPassword2 ? 'text' : 'password'} name="confirm_password" id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                <i id="eye-icon"
                                    className={`fas ${showPassword2 ? 'fa-eye' : 'fa-eye-slash'}`}
                                    onClick={togglePasswordVisibility2}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                ></i>
                            </div>
                            <div>Profile Image: <input type="file" name="image" onChange={handleImageChange} required /></div>
                            <div className="modal-footer">
                                <button type="submit">Signup</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>{message}</div>
            </div>
        </div>
        </>
        
    );
};

export { LoginModal, SignupModal };