import dateFormat from 'dateformat';
import { Link, useNavigate } from 'react-router-dom';
import { recipeSelectionActions } from '../store/index.js'
import { useDispatch, useSelector } from 'react-redux';

import axios from "axios";
import { useEffect, useState } from 'react';

const getRecipeIngredientsURL = 'http://127.0.0.1:8000/recipes/viewrecipeingredients';

export default function GenerateListRecipe({ id, name, date }) {
    const [ingredients, setIngredients] = useState([]);
    const [checked, setChecked] = useState(false);

    const dispatch = useDispatch();
    const dateFormatted = dateFormat(date, "dddd, mmmm dS, yyyy");

    useEffect(() => {
        return () => dispatch(recipeSelectionActions.removeRecipe(id));
    }, []);

    function handleViewRecipeDetails(recipeId, event) {
        event.preventDefault();

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

    function toggleCheckboxClick(recipeId) {
        if (!checked) {
            dispatch(recipeSelectionActions.addRecipe(recipeId));
            setChecked(true);
        } else {
            dispatch(recipeSelectionActions.removeRecipe(recipeId));
            setChecked(false);
        }
    }

    function hideRecipeDetails() {
        setIngredients([]);
    }


    return (
        <>
            {ingredients.length === 0 && (
                <div key={id}>
                    <li key={id}>{name}, added {dateFormatted}</li>
                    <button onClick={(event) => handleViewRecipeDetails(id, event)}>view recipe details</button>
                    <label class="checkbox">
                        <input 
                            type="checkbox" 
                            id={id}
                            name={id} 
                            onClick={() => toggleCheckboxClick(id)}
                            value={checked}
                        />
                         Add Recipe
                    </label>
                </div>
            )}
            {ingredients.length !== 0 && (
                <div key={id}>
                    <li key={id}>{name}, added {dateFormatted}</li>
                    {ingredients.map((ingredient) => (
                        <p key={ingredient[0]}>{ingredient[0]} {ingredient[1]} {ingredient[2]}</p>
                    ))}
                    <button onClick={() => hideRecipeDetails(id)}>hide recipe details</button>
                    <label class="checkbox">
                        <input 
                            type="checkbox" 
                            id={id}
                            name={id} 
                            onClick={() => toggleCheckboxClick(id)}
                            value={checked}
                        />
                         Add Recipe
                    </label>
                </div>
            )}
        </>
    );
}