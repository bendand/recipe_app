import React, {useContext, useEffect} from "react";
// import { useAuth } from "../context/AuthContext";

import { useSelector } from 'react-redux';

import { Link, useNavigate, Outlet } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.authentication.currentUser.payload);

    useEffect(() => {
        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
        }
    })

    return (
        <div>
            <nav>
                <Link to="/logout" className='nav-element'>Log Out</Link> 
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                {/* <Outlet /> */}
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            <p>Welcome to The Shopping List, a tool that turns your cluttered recipes into one condensed shopping list.</p>
        </div>
    );
} 