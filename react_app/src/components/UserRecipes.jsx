import { useFetch } from "../hooks/useFetch";


import Recipes from "./Recipes";
import Error from "./Error";
import UserRecipesRecipe from "./UserRecipesRecipe";

import { Link, useNavigate, Outlet } from 'react-router-dom';

import { useSelector } from "react-redux";

import axios from "axios";

// import { fetchUserRecipes } from "../http.js";
import { useEffect, useState } from "react";

const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

export default function UserRecipes() {
    const [userRecipes, setUserRecipes] = useState([]);
    const currentUser = useSelector(state => state.currentUser.payload);

    const navigate = useNavigate();


    // for (const recipe of userRecipes) {
    //     console.log(recipe);
    // }


    

    // if (userRecipes !== []) {
    //     // console.log('theres some recipes here');
    //     for (var i = 0, l = userRecipes.length; i < l; i++) {
    //         console.log(userRecipes.name);
    //     }
    // }

    // console.log(userRecipes);

    useEffect(() => {

        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
        }

        const fetchUserRecipesAPI = () => {
            try {
                axios.get(userRecipesURL, {
                    params: {
                        userId: currentUser.userId
                    }
                })
                .then(function (response) {
                    if (response.status === 204) {
                        alert(response.message);
                    } else if (response.status === 200) {
                        const recipes = response.data;
                        setUserRecipes(recipes);
                    }
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
                // if (!error?.response) {
                //     setErrorMessage('No Server Response');
                // } else {
                //     setErrorMessage('Fetching user recipes failed');
                // }
            }
        }

        fetchUserRecipesAPI();
    }, [])

    // const { 
    //     isFetching, 
    //     error, 
    //     fetchedData: userRecipes,
    //     setFetchedData: setUserRecipes
    // } = useFetch(fetchUserRecipes, []);

    // if (error) {
    //     return <Error title="An error occurred!" message={error.message}/>
    // }

    // function handleSelectRecipe() {
    //     return 
    // }

    return (
        <div>
            <nav>
                <Link to="/logout" className='nav-element'>Log Out</Link> 
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                <Outlet />
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            <h2>my recipes</h2>
            {/* /* {error && <Error title="An error occurred" message={error.message}/>} */}
            {userRecipes.map((recipe) => (
                <UserRecipesRecipe 
                    name={recipe.name}
                    date={recipe.date}
                    id={recipe.id}
                    key={recipe.id}
                />
            ))}
            {/* {userRecipes.length !== 0 && (
                <Recipes 
                    title="${user.username}'s recipes"
                    recipes={userRecipes}
                    isLoading={isFetching}
                    loadingText="Fetching recipes..."
                    fallbackText="No recipes available."
                />
            )} */}
            {/* {!error } */ }
            
        </div>
    );
}