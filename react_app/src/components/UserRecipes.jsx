import { useFetch } from "../hooks/useFetch.js";
import UserRecipesRecipe from "./UserRecipesRecipe";

import { Link, useNavigate, Outlet } from 'react-router-dom';

import { useSelector } from "react-redux";

import axios from "axios";

import Error from "./Error.jsx";

// import { fetchUserRecipes } from "../http.js";
import { useEffect, useState } from "react";



export default function UserRecipes() {
    const [userRecipes, setUserRecipes] = useState([]);
    const [error, setError] = useState();

    const navigate = useNavigate();
    const currentUser = useSelector(state => state.authentication.currentUser.payload);
    const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

    useEffect(() => {
        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
        }

        const fetchUserRecipesAPI = () => {
            try {
                axios.get(userRecipesURL, {
                    params: {
                        userId: currentUser['userId'],
                    }
                })
                .then(function (response) {
                    if (response.status === 204) {
                        alert(response.message);
                    } else if (response.status === 200) {
                        const recipes = response.data.recipes;
                        setUserRecipes(recipes);
                    }
                })
            } catch (error) {
                console.log(error);
                setError(error);
                alert('request failed');
            }
        }

        fetchUserRecipesAPI();

        return () => setUserRecipes([]);

    }, []);


    return (
        <>
            <header>
                <nav class="navbar is-fixed-top">
                    <Link to="/dashboard" class='navbar-item'>The Shopping List</Link>
                    <Link to="/account" className='navbar-item'>Account</Link>
                    <Link to="/addrecipe" className='navbar-item'>Add a Recipe</Link>
                    <Link to="/myrecipes" className='navbar-item'>My Recipes</Link>
                    <Outlet />
                    <Link to="/generatelist" className='navbar-item'>Generate Shopping List</Link>
                </nav>
            </header>
            <div>
                <h2><strong>My Recipes</strong></h2>
            </div>
            <div id="user-recipes" class="level">
                {error && <h3>{error}</h3>}
                {userRecipes.map((recipe) => (
                    <UserRecipesRecipe 
                        name={recipe.name}
                        date={recipe.date}
                        id={recipe.id}
                        key={recipe.id}
                    />
                ))} 
            </div>
        </>
    );
}
