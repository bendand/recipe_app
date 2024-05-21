import React, { useContext, createContext, useState } from "react";

// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

import axios from 'axios';

const loginURL = 'http://127.0.0.1:8000/users/login';

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("site"));
    // const navigate = useNavigate();
    const loginAction = (data) => {
        try {
            axios.post(loginURL, document.querySelector('#login-form'))
            .then(function (response) {
                if (response.data) {
                    setUser(response.data.user);
                    setToken(response.token);
                    localStorage.setItem("site", response.token);
                    // navigate('mainscreenURL');
                    return;
                } else {
                    throw new Error(response.message);
                }
            }
        )} catch (error) {
            console.log(error);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        // navigate("loginpage");
    };

    const value = {user, setUser, isLoggedIn, setIsLoggedIn, token, setToken, loginAction, logOut}

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};