import { useState, useContext } from "react";

import axios from 'axios';
import { authenticationActions } from "../store";
import { useSelector } from 'react-redux';

import { Link, useNavigate } from "react-router-dom";

const addRecipeURL = 'http://127.0.0.1:8000/recipes/add';

const measurementValues = ['tablespoon', 'teaspoon', 'milligram', 'cup', 'ounce', 'pound',
                             'gallon', 'quart', 'pint', 'liter', 'milliliter', 'count', 'gram', 'kilogram']
const sortedMeasurements = measurementValues.sort()

export default function AddRecipe() {
    const currentUser = useSelector(state => state.currentUser.payload);
    
    if (currentUser === undefined) {
        alert('your session has expired, you are being redirected to the homepage');
        navigate('/');
    }
    
    const [recipeState, setRecipeState] = useState({
        name: '',
        ingredients: []
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [enteredIngredientValues, setEnteredIngredientValues] = useState({
        name: '',
        quantity: '',
        measurement: ''
    });
    const [recipeName, setRecipeName] = useState('');

    function handleInputChange(identifier, value) {
        setEnteredIngredientValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }

    function handleRecipeNameChange(event) {
        setRecipeName(event.target.value);
    }

    function handleSubmitRecipe(event) {
        event.preventDefault();


        if (recipeName === '') {
            setErrorMessage('Your recipe needs a name');
            return
        } else if (recipeState.ingredients.length === 0) {
            setErrorMessage('Your recipe needs at least one ingredient');
            return
        }

        const recipeData = {
            userId: currentUser.userId,
            recipe: recipeName,
            ingredients: recipeState.ingredients
        };


        const addRecipeAPI = () => {
            console.log(recipeData);
            try {
                axios({
                    method: 'POST',
                    url: addRecipeURL,
                    data: recipeData
                })
                .then(function (response) {
                    console.log(response);
                    if (response.status === 200) {
                        alert("Recipe added");
                        // loginHandler();
                    }
                })
            } catch (error) {
                if (!error?.response) {
                    setErrorMessage('No Server Response');
                } else {
                    setErrorMessage('Adding Recipe failed');
                }
            }
        }

        addRecipeAPI();
    }

    function handleAddIngredient(event) {
        event.preventDefault();
        if (enteredIngredientValues.name === '' 
            || enteredIngredientValues.quantity === '' 
            || enteredIngredientValues.measurement === '') {

                setErrorMessage('Please select a value for each ingredient input');
                return
            }

        setRecipeState((prevState) => {
            const newIngredient = {
                name: enteredIngredientValues.name,
                quantity: enteredIngredientValues.quantity,
                measurement: enteredIngredientValues.measurement
            };
            setErrorMessage('');
            return {
                ...prevState,
                ingredients: [newIngredient, ...prevState.ingredients]
            }
        });

        setEnteredIngredientValues({
            name: '',
            quantity: '',
            measurement: ''
        });
    }

    function handleDeleteIngredient(name) {
        setRecipeState((prevState) => {
          return {
            ...prevState,
            ingredients: prevState.ingredients.filter((ingredient) => ingredient.name !== name),
          };
        });
    }

    return (
        <div>
            <nav>
                <Link to="/logout" className='nav-element'>Log Out</Link> 
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            <p>Enter your recipe!</p>
            {errorMessage !== '' && (
                <p>* {errorMessage}</p>
            )}
            <form>
                <label>Recipe name:</label>
                <input type="text" value={recipeName} onChange={handleRecipeNameChange} ></input>
                <br />
                <label>
                    Enter the ingredient's name, the quantity, and the measurement
                </label>
                <br />
                <input 
                    label="name"
                    type="name"
                    name="name"
                    id="name"
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    value={enteredIngredientValues.name}
                />
                <input 
                    label="quantity"
                    name="quantity"
                    id="quantity" 
                    type="number"
                    onChange={(event) => handleInputChange('quantity', event.target.value)}
                    value={enteredIngredientValues.quantity} 
                />
                <select 
                    label="measurement"
                    name="measurement"
                    id="measurement"
                    onChange={(event) => handleInputChange('measurement', event.target.value)}
                    value={enteredIngredientValues.measurement}
                >
                    <option defaultValue="" disabled hidden></option>
                    {sortedMeasurements.map((measurement) => (
                        <option key={measurement} id={measurement}>{measurement}</option>
                    ))}
                </select>
                <button onClick={handleAddIngredient}>Add Ingredient</button>
                <br />
                <button onClick={handleSubmitRecipe}>Add Recipe</button>
            </form>
            <ul className="p-4 mt-8 rounded-md bg-stone-100">
            {recipeState.ingredients.map((ingredient) => (
                <li key={ingredient.name} >
                    <span>{ingredient.name} - {ingredient.quantity} {ingredient.measurement}    </span>
                    <button
                        onClick={() => handleDeleteIngredient(ingredient.name)}
                    >
                        Delete 
                    </button>
                    <br />
                </li>
            ))}
            </ul>
        </div>
    )
}