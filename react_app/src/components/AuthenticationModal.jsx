import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import Input from './Input';

import { useInput } from '../hooks/useInput';
import { isNotEmpty, hasMinLength, isEmail } from '../util/validation.js';
import { useSelector, useDispatch } from 'react-redux';
import { authenticationActions } from '../store/index.js';

import { json, Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

const registerURL = 'http://127.0.0.1:8000/users/register';
const loginURL = 'http://127.0.0.1:8000/users/login';

const AuthenticationModal = forwardRef(function AuthenticationModal({ 
    authStatus,
    proceedButtonCaption, 
    setAuthenticatingStatus,
    onCancel }, 
    ref) {
    // const [authenticatingStatus, setAuthenticatingStatus] = useState(authStatus);
    const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const dialog = useRef();

    const {value: emailValue, 
        handleInputChange: handleEmailChange, 
        handleInputBlur: handleEmailBlur,
        hasError: emailHasError
    } = useInput('', (value) => {
        return isNotEmpty(value) && isEmail(value);
    });
    const {value: usernameValue, 
        handleInputChange: handleUsernameChange, 
        handleInputBlur: handleUsernameBlur,
        hasError: usernameHasError
    } = useInput('', (value) => {
        return isNotEmpty(value) && hasMinLength(value, 6);
    });
    const {value: passwordValue,
            handleInputChange: handlePasswordChange,
            handleInputBlur: handlePasswordBlur,
            hasError: passwordHasError
    } = useInput('', (value) => {
        return isNotEmpty(value) && hasMinLength(value, 6);
    })
    const {value: confirmPasswordValue,
        handleInputChange: handleConfirmPasswordChange,
        handleInputBlur: handleConfirmPasswordBlur,
        hasError: confirmPasswordHasError
    } = useInput('', (value) => {
        return isNotEmpty(value) && hasMinLength(value, 6);
    })


    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
            close() {
                dialog.current.close();
            }
        };
    });

    function changeAuthStatus(newStatus) {
        console.log(newStatus);
        setAuthenticatingStatus(newStatus);
    } 

    function handleLogin(event) {
        event.preventDefault();

        console.log('handle login function hit');
        
        if (usernameHasError || passwordHasError) {
            return;
        }

        const postAPI = () => {
            console.log('post API hit');
            axios.post(loginURL, document.querySelector('#login-form'))
            .then(function (response) {
                console.log('positive response registered');
                if (!response) {
                    return
                } else {
                    const userPayload = {
                        'username': response.data.username,
                        'password': response.data.userEmail,
                        'userId': response.data.userId
                    }
                    dispatch(authenticationActions.login(userPayload));
                    dialog.current.close();
                    // alert("Login successful!");
                    navigate('/dashboard');
                    toast.success('Login successful!');
                }
            })
            .catch(function (error) {
                const jsonError = error.toJSON();
                console.log('error registered');
                if (jsonError.status === 404) {
                    setErrorMessage('Your credentials are invalid');
                } else if (jsonError.status === 401) {
                    setErrorMessage('Your password is incorrect');
                } else {
                    setErrorMessage('The server did not respond');
                }
                return
            })
        }

        postAPI();
    } 

    function handleRegister(event) {
        event.preventDefault();

        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        if (data.password !== data['confirm-password']) {
            setPasswordsAreNotEqual(true);
            return 
        }

        const postAPI = () => {
            try {
                axios.post(registerURL, document.querySelector('#register-form'))
                .then(function (response) {
                    if (response.status === 200) {
                        alert("Registration successful!");
                        registrationHandler();
                    }
                })
            } catch (error) {
                console.log(error);
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                } else if (error.response?.status === 401) {
                    setErrorMessage('Unauthorized')
                } else {
                    setErrorMessage('Registration failed');
                }
            }
        }

        postAPI();
    }


    return createPortal(
        <dialog
            ref={dialog}
            className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
        >
        {authStatus === 'register' ? (
            <div>
                <p>Already have an account? <button onClick={() => changeAuthStatus('login')}>Log in</button></p>
                <form id="register-form" onSubmit={handleRegister}>
                    <p>Create Account</p>
                    <Input 
                        label="Email: "
                        id="email"
                        type="email"
                        name="email"
                        onBlur={handleEmailBlur}
                        onChange={handleEmailChange}
                        value={emailValue}
                        error={emailHasError && 'Please enter a valid email'}
                    />
                    <Input 
                        label="Username: "
                        id="username"
                        type="username"
                        name="username"
                        onBlur={handleUsernameBlur}
                        onChange={handleUsernameChange}
                        value={usernameValue}
                        error={usernameHasError && 'Please enter a valid username'}
                    />
                    <Input 
                        label="Password: "
                        id="password"
                        type="password"
                        name="password"
                        onBlur={handleUsernameBlur}
                        onChange={handleUsernameChange}
                        value={usernameValue}
                        error={usernameHasError && 'Passwords must be at least 6 characters'}
                    />
                    <Input 
                        label="Confirm Password: "
                        id="confirm-password"
                        type="confirm-password"
                        name="confirm-password"
                        onBlur={handleConfirmPasswordBlur}
                        onChange={handleConfirmPasswordChange}
                        value={confirmPasswordValue}
                        error={confirmPasswordHasError && 'Passwords must be at least 6 characters'}
                    />
                    <div>
                        {passwordsAreNotEqual && <p>Passwords must match</p>}
                    </div>
                    <p className='form-actions'>
                        <button className="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">Sign Up</button>
                    </p>
                </form>
            </div>

        ) : (
            <div>
                <p>Don't have an account? <button onClick={() => changeAuthStatus('register')}>Sign up</button></p>
                <form id="login-form" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    {errorMessage !== '' && (
                        <p>*{errorMessage}*</p>
                    )}
                    <Input
                        label="Username: "
                        id="username"
                        type="username"
                        name="username"
                        onBlur={handleUsernameBlur}
                        onChange={handleUsernameChange}
                        value={usernameValue}
                        error={usernameHasError && 'Please enter a valid username'}
                    />
                    <Input
                        label="Password: "
                        id="password"
                        type="password"
                        name="password"
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        value={passwordValue}
                        error={passwordHasError && 'Passwords must be at least 6 characters'}
                    />
                    <p className="form-actions">
                        <button className="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">Login</button>
                    </p>
                </form>
            </div>
        )}
    
        {/* <form method="dialog" className="mt-4 text-right">
            <button onClick={onCancel}>{cancelButtonCaption}</button>
            <button onClick={onProceed}>{proceedButtonCaption}</button>
        </form> */}
        </dialog>,
        document.getElementById('modal-root')
    );
});

export default AuthenticationModal;