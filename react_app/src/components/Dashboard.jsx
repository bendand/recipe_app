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
        <>
            <header>
                <nav class="navbar is-fixed-top"> 
                    <Link class='navbar-item disabled'>The Shopping List</Link>
                    <Link to="/account" class="navbar-item">Account</Link>
                    <Link to="/addrecipe" class="navbar-item">Add a Recipe</Link>
                    <Link to="/myrecipes" class="navbar-item">My Recipes</Link>
                    <Link to="/generatelist" class="navbar-item">Generate Shopping List</Link>
                </nav>
            </header>
            <section class="hero is-info is-small">
                <div class="hero-body" id="dashboard-hero">
                    <p class="title">Welcome to The Shopping List</p>
                    <p class="subtitle">The Shopping List is a tool that turns your cluttered recipes into one condensed shopping list.</p>
                </div>
            </section>
        </>
    );
} 