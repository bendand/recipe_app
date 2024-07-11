import dateFormat from 'dateformat';
import { useState, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import axios from "axios";
import Modal from './Modal';
import EditRecipeModal from './EditRecipeModal.jsx';

const measurementValues = ['tablespoon', 'teaspoon', 'milligram', 'cup', 'ounce', 'pound',
                             'gallon', 'quart', 'pint', 'liter', 'milliliter', 'count', 'gram', 'kilogram']
const sortedMeasurements = measurementValues.sort()

const getRecipeIngredientsURL = 'http://127.0.0.1:8000/recipes/viewrecipeingredients';
const updateRecipeURL = 'http://127.0.0.1:8000/recipes/updaterecipe';
const deleteRecipeURL = 'http://127.0.0.1:8000/recipes/deleterecipe';

export default function UserRecipesRecipe({ name, date, id }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [initialIngredients, setInitialIngredients] = useState([]);
    const [ingredientsCopy, setIngredientsCopy] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const [isAddingIngredient, setIsAddingIngredient] = useState(false);
    const [enteredIngredientValues, setEnteredIngredientValues] = useState({
        name: '',
        quantity: '',
        measurement: ''
    });


    // const dateFormatted = dateFormat(date, "mmmm yyyy");
    const deleteModal = useRef();
    const editRecipeModal = useRef();
    let recipeIdDeleting = null;


    function handleAddIngredient() {
        try {
            if (enteredIngredientValues.name === '' 
            || enteredIngredientValues.quantity === '' 
            || enteredIngredientValues.measurement === '') {
                setErrorMessage('Please select a value for each ingredient input');
                return
            }

            const newIngredient = [
                enteredIngredientValues.name,
                parseFloat(enteredIngredientValues.quantity),
                enteredIngredientValues.measurement
            ];

            setErrorMessage('');

            setIngredientsCopy( 
                [
                    newIngredient,
                    ...ingredientsCopy
                ]
            );

            setEnteredIngredientValues({
                name: '',
                quantity: '',
                measurement: ''
            });

            setHasEdited(true);

            return
            
        } catch (error) {
            alert(error);
        }

    }
    

    function handleViewRecipeDetails(recipeId) {
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
                        setInitialIngredients(ingredients);
                        setIngredientsCopy(ingredients);
                    }
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
            }
        }

        fetchRecipeIngredientsAPI();

        return
    }

    function hideRecipeDetails() {
        return setInitialIngredients([]);
    }

    // function toggleIsEditing() {
    //     if (isEditing) {
    //         setIsEditing(false);
    //         setIngredientsCopy(initialIngredients);
    //         return
    //     } else {
    //         return setIsEditing(true);
    //     }
    // }

    function handleEditRecipe() {
        modal.current.open();
    }

    function handleInputChange(identifier, value) {
        return setEnteredIngredientValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }

    function handleStartAddIngredient() {
        return setIsAddingIngredient((prevState) => !prevState);
    }

    function handleRemoveIngredient(ingredientName) {
        setIngredientsCopy(
            ingredientsCopy.filter(ingredient => ingredient[0] !== ingredientName)
        );

        setHasEdited(true);
        return
    }

    function handleStartDeleteRecipe(recipeId) {
        recipeIdDeleting = recipeId;
        deleteModal.current.open();
        return
    }

    function handleCancelDeleteRecipe() {
        recipeIdDeleting = null;
        deleteModal.current.close();
        return
    }

    function handleDeleteRecipe() {
        const deleteRecipeAPI = () => {
            try {
                axios.post(deleteRecipeURL, {
                    recipeIdDeleting
                })
                .then(function (response) {
                    if (response.status === 200) {
                        alert(response.data.message);
                    }
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
            }
        }

        deleteRecipeAPI();

        return
    }

    function handleSaveChanges(recipeId) {
        const updateRecipeAPI = () => {
            try {
                axios.post(updateRecipeURL, {
                    recipeId,
                    ingredientsCopy
                })
                .then(function (response) {
                    if (response.status === 200) {
                        alert(response.data.message);
                        setIsEditing(false);
                    }
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
            }
        }

        updateRecipeAPI();

        return
    }
        

    return (
        <>
            <Modal 
                ref={deleteModal}
                cancelButtonCaption="Cancel" 
                proceedButtonCaption="Delete Recipe" 
                onCancel={() => handleCancelDeleteRecipe()}
                onDelete={() => handleDeleteRecipe()}
            >
                Are you sure you want to delete this recipe?
            </Modal>
            <EditRecipeModal
                ingredients={initialIngredients}
                recipeId={id}
                recipeName={name}
            />
            {initialIngredients.length === 0 && (
                <div key={id}>
                    <elem key={id}>{name}
                        <button onClick={() => handleViewRecipeDetails(id)}>view recipe details</button>
                    </elem> 
                </div>
            )}
            {initialIngredients.length !== 0 && !isEditing && (
                <div key={id}>
                    <span key={id}>{name}</span><button onClick={() => hideRecipeDetails()}>hide recipe details</button>
                    {ingredientsCopy.map((ingredient) => (
                        <p key={ingredient[0]}>{ingredient[0]} {ingredient[1]} {ingredient[2]}</p>
                    ))}
                    <button onClick={() => handleStartDeleteRecipe(id)}>delete recipe</button>
                    <button onClick={() => handleEditRecipe()}>{!isEditing ? 'edit recipe' : 'cancel edit'}</button>
                    {isEditing && <button onClick={() => handleSaveChanges(recipeId)}>Save Changes</button>}
                </div>
            )}  
            {initialIngredients.length !== 0 && isEditing && (
                <div>
                    <span>{name}</span>
                    <button onClick={() => hideRecipeDetails()}>hide recipe details</button>
                    <button onClick={() => handleStartAddIngredient()}>{!isAddingIngredient ? 'add ingredient': 'cancel adding ingredient'}</button>
                    {errorMessage !== '' && <p>{errorMessage}</p>}
                    {isAddingIngredient && (
                        <form>
                            <label>Enter the ingredient's name, the quantity, and the measurement</label>
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
                            <button type="button" onClick={() => handleAddIngredient()}>add ingredient</button>
                        </form>
                    )}
                    <ul>
                    {ingredientsCopy.map((ingredient) => (
                        <li key={ingredient[0]}>
                            <span >{ingredient[0]} {ingredient[1]} {ingredient[2]}</span>
                            <button onClick={() => handleRemoveIngredient(ingredient[0])}>remove</button>
                        </li>
                    ))}
                    </ul>
                    <button onClick={() => hideRecipeDetails()}>hide recipe details</button>
                    <button onClick={() => toggleIsEditing()}>{!isEditing ? 'edit recipe' : 'cancel edit'}</button>
                    {hasEdited && <button onClick={() => handleSaveChanges(id)}>Save Changes</button>}
                </div>
            )}
        </>
    );
}

