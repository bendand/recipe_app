import { useFetch } from "../hooks/useFetch";

import UserRecipesRecipe from "./UserRecipesRecipe";

import { Link, useNavigate, Outlet } from 'react-router-dom';

import { useSelector } from "react-redux";

import axios from "axios";

// import { fetchUserRecipes } from "../http.js";
import { useEffect, useState } from "react";

const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

export default function UserRecipes() {
    const [userRecipes, setUserRecipes] = useState([]);
    const currentUser = useSelector(state => state.authentication.currentUser.payload);
    const navigate = useNavigate();


    useEffect(() => {
        // if (currentUser === undefined) {
        //     alert('your session has expired, you are being redirected to the homepage');
        //     navigate('/');
        // }

        // which call to the backend is preferred?
        // async function fetchUserRecipes() {
        //     setIsFetching(true);
        //     try {
        //         const recipes = await fetchUserRecipes();
        //         setUserRecipes(recipes);
        //     } catch (error) {
        //         setError({ message: error.message || 'Failed to fetch user recipes.'})
        //     }

        //     setIsFetching(false);
        // }

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
            }
        }

        fetchUserRecipesAPI();

        return () => setUserRecipes([]);

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