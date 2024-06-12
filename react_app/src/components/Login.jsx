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
            axios.post(loginURL, document.querySelector('#login-form'))
            .catch(function (error) {
                const jsonError = error.toJSON();
                if (jsonError.status === 404) {
                    setErrorMessage('Your credentials are invalid');
                } else if (jsonError.status === 401) {
                    setErrorMessage('Your password is incorrect');
                } else {
                    setErrorMessage('The server did not respond');
                }
                return
            })
            .then(function (response) {
                if (!response) {
                    return
                } else {
                    const userPayload = {
                        'username': response.data.username,
                        'password': response.data.userEmail,
                        'userId': response.data.userId
                    }
                    dispatch(authenticationActions.login(userPayload));
                    alert("Login successful!");
                    navigate('/dashboard');
                }
            });
        }

        postAPI();
    }


    return (
        <div>
            <p className='nav-element'>Don't have an account? <Link to="/register" >Register</Link></p>
            <form onSubmit={handleSubmit} id="login-form">
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
                    <button className="button button-flat">Reset</button>
                    <button className="button">Login</button>
                </p>
            </form>
        </div>
    );
}