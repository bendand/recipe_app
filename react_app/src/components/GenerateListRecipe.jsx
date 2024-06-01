import dateFormat from 'dateformat';
import { Link, useNavigate } from 'react-router-dom';
import { recipeSelectionActions } from '../store/index.js'
import { useDispatch, useSelector } from 'react-redux';

import axios from "axios";
import { useEffect, useState } from 'react';

const getRecipeIngredientsURL = 'http://127.0.0.1:8000/recipes/viewrecipeingredients';

export default function GenerateListRecipe({ id, name, date, onClick, checkedValue }) {
    const [ingredients, setIngredients] = useState([]);
    const [checked, setChecked] = useState(false);
    const recipeIdList = useSelector(state => state.recipeSelection.recipeIdsForShoppingList);

    const dispatch = useDispatch();

    // console.log(id + ' checked status is ' + checked);
    // const navigate = useNavigate();

    const dateFormatted = dateFormat(date, "dddd, mmmm dS, yyyy");

    // useEffect(() => {
    //     if (recipeIdList === undefined) {
    //         console.log('recipeIdList is undefined');
    //     } else {
    //         console.log('recipe id list: ' + JSON.stringify(recipeIdList));
    //     }
    // })

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
                    <button onClick={() => viewRecipeDetails(id)}>view recipe details</button>
                    <input 
                        type="checkbox" 
                        id={id}
                        name={id} 
                        onClick={() => toggleCheckboxClick(id)}
                        value={checked}
                    />
                    <label>add recipe</label>
                </div>
            )}
            {ingredients.length !== 0 && (
                <div key={id}>
                    <li key={id}>{name}, added {dateFormatted}</li>
                    {ingredients.map((ingredient) => (
                        <p key={ingredient[0]}>{ingredient[0]} {ingredient[1]} {ingredient[2]}</p>
                    ))}
                    <button onClick={() => hideRecipeDetails(id)}>hide recipe details</button>
                    <input 
                        type="checkbox" 
                        id={id}
                        name={id} 
                        onClick={() => toggleCheckboxClick(id)}
                        value={checkedValue}
                    />
                    <label>add recipe</label>
                </div>
            )}
        </>
    );
}