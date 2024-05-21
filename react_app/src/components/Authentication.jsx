import { useState } from "react"

import { Link } from 'react-router-dom';

import Login from "./Login";
import Register from "./Register";

export default function Authentication() {
    // const [isRegistering, setIsRegistering] = useState(false);
    // const [isLoggingIn, setIsLoggingIn] = useState(false);


    // function handleLogin() {
    //     setIsRegistering(false);
    //     setIsLoggingIn(true);
    // }
    
    // function handleRegister() {
    //     setIsLoggingIn(false);
    //     setIsRegistering(true);
    // }

    return (
        <div>
            <nav>
                <Link to="/login" className='nav-element'>Login</Link>
                <Link to="/register" className='nav-element'>Register</Link>
            </nav>
            <div>
                <h1><strong>The Shopping List</strong></h1>
                <p>The Shopping List turns your cluttered recipes into one condensed shopping list.</p>
            </div>
            {/* {isRegistering && <Register />}
            {isLoggingIn && <Login />} */}
        </div>
    )
    
}