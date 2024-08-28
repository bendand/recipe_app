import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';

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
        setAuthenticatingStatus(newStatus);
        modal.current.open();
    }

    function cancelAuthenticate() {
        modal.current.close();
        setAuthenticatingStatus('');
    }

    // id="authentication-div"

    return (
        <section>
            <header>
                <nav class="navbar is-fixed-top">
                    <Link class='navbar-item disabled'>The Shopping List</Link>
                    <Link onClick={handleStartLogin} class='navbar-item'>Login</Link>
                    <Link onClick={handleStartRegister} class='navbar-item'>Register</Link>
                </nav>
            </header>
            <div class="container is-max-desktop">
                <h1><strong>The Shopping List</strong></h1>
                <p>The Shopping List turns your cluttered recipes into one condensed shopping list.</p>
            </div>
            <AuthenticationModal 
                ref={modal}
                authStatus={authenticatingStatus}
                setAuthenticatingStatus={changeAuthenticatingStatus}
                onCancel={cancelAuthenticate}
            />
        </section>
    )
    
}