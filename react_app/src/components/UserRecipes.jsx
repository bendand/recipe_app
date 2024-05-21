import { useFetch } from "../hooks/useFetch";

import { useSelector } from "react-redux";

import Recipes from "./Recipes";
import Error from "./Error";

import { Link, useNavigate } from 'react-router-dom';

import { fetchUserRecipes } from "../http.js";

export default function UserRecipes() {
    const currentUser = useSelector(state => state.currentUser);

    if (currentUser === undefined) {
        alert('your session has expired, you are being redirected to the homepage');
        navigate('/');
    }

    const { 
        isFetching, 
        error, 
        fetchedData: userRecipes,
        setFetchedData: setUserRecipes
    } = useFetch(fetchUserRecipes, []);

    if (error) {
        return <Error title="An error occurred!" message={error.message}/>
    }

    // function handleSelectRecipe() {
    //     return 
    // }

    return (
        <div>
            {error && <Error title="An error occurred" message={error.message}/>}
            {!error && userRecipes.length !== 0 && (
                <Recipes 
                    title="${user.username}'s recipes"
                    recipes={userRecipes}
                    isLoading={isFetching}
                    loadingText="Fetching recipes..."
                    fallbackText="No recipes available."
                />
            )}
            {!error }
        </div>
    );
}