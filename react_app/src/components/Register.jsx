import Input from "./Input";

import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { authenticationActions } from '../store/index';
import axios from 'axios';
 
import { Link, useNavigate } from 'react-router-dom';

const registerURL = 'http://127.0.0.1:8000/users/register';

export default function Register() {
    const dispatch = useDispatch();

    const registrationHandler = () => {
        dispatch(authenticationActions.register());
        currentUser = {
            email: enteredValues.email,
            password: enteredValues.password
        }
    }

    const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    function handleSubmit(event) {
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

    return (
        <div>
            <nav className='authentication-nav'>
                <Link to="/login" className='nav-element push'>Login</Link>
                <Link to="/register" className='nav-element push'>Register</Link>
            </nav>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            {errorMessage !== '' && (
                <p>*{errorMessage}*</p>
            )}
            <form onSubmit={handleSubmit} id="register-form">
                <h2>Welcome!</h2>
                <p>We just need some information to get you started.</p>
                <Input 
                    label="Email: "
                    id="email"
                    type="email"
                    name="email"
                    required
                />
                <Input 
                    label="Username: "
                    id="username"
                    type="username"
                    name="username"
                    required
                />
                <Input 
                    label="Password: "
                    id="password"
                    type="password"
                    name="password"
                    required
                    minLength={6}
                />
                <Input 
                    label="Confirm Password: "
                    id="confirm-password"
                    type="confirm-password"
                    name="confirm-password"
                    required
                    minLength={6}
                />
                <div>
                    {passwordsAreNotEqual && <p>Passwords must match</p>}
                </div>
                <p>
                    <button type="reset">Reset</button>
                    <button type="submit">Sign Up</button>
                </p>
            </form>
        </div>
    );
}