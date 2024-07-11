import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Formik } from 'formik';

import AuthenticationModal from './AuthenticationModal';

export default function Authentication() {
    const [authenticatingStatus, setAuthenticatingStatus] = useState('')

    console.log(authenticatingStatus);

    const modal = useRef();

    function handleStartLogin() {
        setAuthenticatingStatus('login');
        modal.current.open();
    }

    function handleStartRegister() {
        setAuthenticatingStatus('register');
        modal.current.open();
    }

    function changeAuthenticatingStatus(newStatus) {
        console.log(newStatus);
        setAuthenticatingStatus(newStatus);
        modal.current.open();
    }

    function cancelAuthenticate() {
        setAuthenticatingStatus('');
        modal.current.close();
    }

    return (
        <div>
            <AuthenticationModal 
                ref={modal}
                authStatus={authenticatingStatus}
                changeAuthStatus={() => changeAuthenticatingStatus(newStatus)}
                onCancel={() => cancelAuthenticate()}
            />
            <nav className='authentication-nav'>
                <Link onClick={handleStartLogin} className='nav-element'>Login</Link>
                <Link onClick={handleStartRegister} className='nav-element'>Register</Link>
            </nav>
            <div class="theme-dark">
                <h1><strong>The Shopping List</strong></h1>
                <p>The Shopping List turns your cluttered recipes into one condensed shopping list.</p>
            </div>
        </div>
    )
    
}