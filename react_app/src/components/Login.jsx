import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

import Input from './Input.jsx';
import { authenticationActions } from '../store/index.js';
import { useInput } from '../hooks/useInput.js';

import axios from 'axios';
import { isNotEmpty, hasMinLength } from '../util/validation.js';

const loginURL = 'http://127.0.0.1:8000/users/login';

export default function Login() {
    const {value: usernameValue, 
            handleInputChange: handleUsernameChange, 
            handleInputBlur: handleUsernameBlur,
            hasError: usernameHasError
        } = useInput('', (value) => {
            // can expound upon validation functions here
            return isNotEmpty(value);
        });

    const {value: passwordValue,
            handleInputChange: handlePasswordChange,
            handleInputBlur: handlePasswordBlur,
            hasError: passwordHasError
        } = useInput('', (value) => {
            // can expound upon validation functions here
            return isNotEmpty(value) && hasMinLength(value, 6);
        })

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();


    function handleSubmit(event) {
        event.preventDefault();
        
        if (usernameHasError || passwordHasError) {
            return;
        }

        const postAPI = () => {
            try {
                axios.post(loginURL, document.querySelector('#login-form'))
                .then(function (response) {
                    if (response.status === 200) {
                        const userPayload = {
                            'username': response.data.username,
                            'password': response.data.userEmail,
                            'userId': response.data.userId
                        }
                        dispatch(authenticationActions.login(userPayload));
                        alert("Login successful!");
                        navigate('/dashboard');
                    } else {
                        console.log(response);
                        console.log(response.status);
                    }
                    // } else if (response.status === 401) {
                    //     setErrorMessage('Password is incorrect');
                    // } else if (response.status === 404) {
                    //     setErrorMessage('We do not recognize your username');
                    // } else if (!response.status) {
                    //     setErrorMessage('The server did not respond');
                    // }
                })
            } catch (error) {
                console.log(error);
                console.log(error.message);
            }
        }

        postAPI();
    }


    return (
        <div>
            <p className='nav-element'>Don't have an account? <Link to="/register" >Register</Link></p>
            {errorMessage !== '' && (
                <p>*{errorMessage}*</p>
            )}
            <form onSubmit={handleSubmit} id="login-form">
                <h2>Login</h2>
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
                    <button className="button button-flat">Reset</button>
                    <button className="button">Login</button>
                </p>
            </form>
        </div>
    );
}