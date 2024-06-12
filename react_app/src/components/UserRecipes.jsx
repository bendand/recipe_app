import { useFetch } from "../hooks/useFetch.js";
import { useHttp } from '../hooks/useHttp.js';
import UserRecipesRecipe from "./UserRecipesRecipe";

import { Link, useNavigate, Outlet } from 'react-router-dom';

import { useSelector } from "react-redux";

import axios from "axios";

import Error from "./Error.jsx";

// import { fetchUserRecipes } from "../http.js";
import { useEffect, useState } from "react";



export default function UserRecipes() {
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.authentication.currentUser.payload);
    const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

    // console.log(currentUser.userId);
    // const requestConfig = {
    //     id: currentUser.userId
    // }

    const {
        data: loadedRecipes,
        isLoading,
        error
    } = useHttp(userRecipesURL, {}, []);

    console.log(loadedRecipes);
    console.log(error);


    if (isLoading) {
        return <p>fetching meals...</p>
    }

    if (error) {
        return <Error />
    }

    // if (!data) {
    //     return <p>no meals found.</p>
    // }

    // const { isFetching, 
    //     fetchedData: userRecipes,
    //     error ,
    //     setFetchedData: setUserRecipes
    // } = useFetch(fetchUserRecipes, []);
    
    // console.log(isFetching);
    // console.log(userRecipes);
    // console.log(error);
    

    useEffect(() => {
        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
        }

        // const fetchUserRecipesAPI = () => {
        //     try {
        //         axios.get(userRecipesURL, {
        //             params: {
        //                 userId: currentUser.userId
        //             }
        //         })
        //         .then(function (response) {
        //             if (response.status === 204) {
        //                 alert(response.message);
        //             } else if (response.status === 200) {
        //                 const recipes = response.data;
        //                 setUserRecipes(recipes);
        //             }
        //         })
        //     } catch (error) {
        //         console.log(error);
        //         alert('request failed');
        //     }
        // }

        // fetchUserRecipesAPI();

        // return () => setUserRecipes([]);

    }, [])


    return (
        <div>
            <nav>
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                <Outlet />
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            <h2>my recipes</h2>
            {loadedRecipes.map((recipe) => (
                <UserRecipesRecipe 
                    name={recipe.name}
                    date={recipe.date}
                    id={recipe.id}
                    key={recipe.id}
                />
            ))} 
        </div>
    );
}
