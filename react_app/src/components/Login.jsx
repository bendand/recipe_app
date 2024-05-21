import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

import Input from './Input.jsx';
import { authenticationActions } from '../store/index.js';

import axios from 'axios';

const loginURL = 'http://127.0.0.1:8000/users/login';

export default function Login() {
    const navigate = useNavigate();

    const [enteredValues, setEnteredValues] = useState({
        username: '',
        password: '',
    });
    const [didEdit, setDidEdit] = useState({
        username: false,
        password: false,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const passwordIsInvalid =
        didEdit.password && enteredValues.password.trim().length < 6;

    const loginHandler = () => {
        dispatch(authenticationActions.login(enteredValues));
        // useAuth(enteredValues);
    }

    const navigateHandler = () => {
        navigate('/dashboard')
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        if (passwordIsInvalid) {
            return;
        }

        const postAPI = () => {
            try {
                axios.post(loginURL, document.querySelector('#login-form'))
                .then(function (response) {
                    if (response.status === 200) {
                        // here current user id needs to be captured and sent to our state management system
                        const userPayload = {
                            'username': response.data.username,
                            'password': response.data.userEmail,
                            'userId': response.data.userId
                        }
                        dispatch(authenticationActions.login(userPayload));
                        alert("Login successful!");
                        navigateHandler();
                    }
                })
            } catch (error) {
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                } else if (error.response?.status === 400) {
                    setErrorMessage('Missing username or password');
                } else if (error.response?.status === 401) {
                    setErrorMessage('Unauthorized')
                } else {
                    setErrorMessage('Login failed');
                }
            }
        }

        postAPI();
    }

    function handleInputChange(identifier, value) {
        setEnteredValues((prevValues) => ({
        ...prevValues,
        [identifier]: value,
        }));
        setDidEdit((prevEdit) => ({
        ...prevEdit,
        [identifier]: false,
        }));
    }

    function handleInputBlur(identifier) {
        setDidEdit((prevEdit) => ({
        ...prevEdit,
        [identifier]: true,
        }));
    }

    return (
        <div>
            <p className='nav-element'>Don't have an account? <Link to="/register" >Register</Link></p>
            {errorMessage !== '' && (
                <p>*{errorMessage}*</p>
            )}
            <form onSubmit={handleSubmit} id="login-form">
                <h2>Login</h2>

                <div className="control-row">
                    <Input
                        label="Username"
                        id="username"
                        type="username"
                        name="username"
                        onBlur={() => handleInputBlur('username')}
                        onChange={(event) => handleInputChange('username', event.target.value)}
                        value={enteredValues.username}
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        onChange={(event) =>
                            handleInputChange('password', event.target.value)
                        }
                        onBlur={() => handleInputBlur('password')}
                        value={enteredValues.password}
                        error={passwordIsInvalid && 'Please enter a valid password!'}
                    />
                </div>

                <p className="form-actions">
                    <button className="button button-flat">Reset</button>
                    <button className="button">Login</button>
                </p>
            </form>
        </div>
    );
}