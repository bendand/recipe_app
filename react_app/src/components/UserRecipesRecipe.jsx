import dateFormat from 'dateformat';
import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import axios from "axios";

const getRecipeIngredientsURL = 'http://127.0.0.1:8000/recipes/viewrecipeingredients';

export default function UserRecipesRecipe({ name, date, id }) {
    const [ingredients, setIngredients] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const dateFormatted = dateFormat(date, "dddd, mmmm dS, yyyy");

    function viewRecipeDetails(recipeId) {
        const fetchRecipeIngredientsAPI = () => {
            try {
                axios.get(getRecipeIngredientsURL, {
                    params: {
                        recipeId
                    }
                })
                .then(function (response) {
                    if (response.status === 200) {
                        const ingredients = response.data;
                        setIngredients(ingredients);
                    }
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
            }
        }

        fetchRecipeIngredientsAPI();
    }

    function hideRecipeDetails() {
        setIngredients([]);
    }

    function handleIsEditing() {
        setIsEditing(true);
    }
        

    return (
        <>
            {ingredients.length === 0 && (
                <div key={id}>
                    <li key={id}>{name}, added {dateFormatted}</li>
                    <button onClick={() => viewRecipeDetails(id)}>view recipe details</button>

                </div>
            )}
            {ingredients.length !== 0 && (
                <div key={id}>
                    <li key={id}>{name}, added {dateFormatted}</li>
                    {ingredients.map((ingredient) => (
                        <p key={ingredient[0]}>{ingredient[0]} {ingredient[1]} {ingredient[2]}</p>
                    ))}
                    <button onClick={() => hideRecipeDetails(id)}>hide recipe details</button>
                </div>
            )}
        </>
    );
}