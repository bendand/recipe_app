import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import EditableIngredient from './EditableIngredient';

import { Link, useNavigate, Outlet } from "react-router-dom";

const measurementValues = ['tablespoon', 'teaspoon', 'milligram', 'cup', 'ounce', 'pound',
                             'gallon', 'quart', 'pint', 'liter', 'milliliter', 'count', 'gram', 'kilogram']
const sortedMeasurements = measurementValues.sort();

const updateRecipeURL = 'http://127.0.0.1:8000/recipes/updaterecipe';

const EditRecipeModal = forwardRef(function Modal({ 
    ingredients, 
    recipeId, 
    recipeName, 
    onProceed,
    onCancel,
    updateIngredientList,
    cancelButtonCaption,
    proceedButtonCaption
 }, ref) {
    const [errorMessage, setErrorMessage] = useState('');
    const [hasEdited, setHasEdited] = useState(false);
    const [isAddingIngredient, setIsAddingIngredient] = useState(false);
    const [ingredientsCopy, setIngredientsCopy] = useState([]);
    const [enteredIngredientValues, setEnteredIngredientValues] = useState({
        name: '',
        quantity: '',
        measurement: ''
    });
    const dialog = useRef();


    useEffect(() => {
        setIngredientsCopy(ingredients);
    }, [ingredients]);


    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
            close() {
                dialog.current.close();
            }
        };
    });

    function handleInputChange(identifier, value) {
        return setEnteredIngredientValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }

    function handleUpdateIngredient(ingredientName, updatedValues) {
        if (updatedValues.name === '' 
            || updatedValues.quantity === '' 
            || updatedValues.measurement === '') {
                // setErrorMessage('Please select a value for each ingredient input');
            return
        }

        const ingredientsNoOldIngredient = ingredientsCopy.filter(ingredient => ingredient[0] !== ingredientName);
        const newIngredient = [updatedValues.name, parseFloat(updatedValues.quantity), updatedValues.measurement];
        const ingredientsUpdated = [newIngredient, ...ingredientsNoOldIngredient]

        setHasEdited(true);
        setIngredientsCopy(ingredientsUpdated);

        return

        // figure out how validation and error messages are going to be displayed here
        // only state that should be updated should be the original list of ingredients?
        // on successful response, the modal should be closed, a toast is needed indicating success, and the 
        // user recipes should show an updated recipe
    }

    function handleDeleteIngredient(ingredientName) {
        const newIngredients = ingredientsCopy.filter(ingredient => ingredient[0] !== ingredientName);

        setIngredientsCopy(newIngredients);
        setHasEdited(true);

        return
    }

    function handleInputChange(identifier, value) {
        return setEnteredIngredientValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }

    function handleStartAddIngredient() {
        setIsAddingIngredient(true);
    }

    function handleCancelAddIngredient() {
        setIsAddingIngredient(false);
    }

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

            setHasEdited(true);

            setEnteredIngredientValues({
                name: '',
                quantity: '',
                measurement: ''
            });

            setIsAddingIngredient(false);

            return
            
        } catch (error) {
            alert(error);
        }

    }

    function handleSaveChanges() {
        const updateRecipeAPI = () => {
            try {
                axios.post(updateRecipeURL, {
                    recipeId,
                    ingredientsCopy
                })
                .then(function (response) {
                    if (response.status === 200) {
                    }
                })
            } catch (error) {
                alert('request failed');
            }
        }

        updateRecipeAPI();
        updateIngredientList(ingredientsCopy);
    }

    return createPortal(
        <dialog
            ref={dialog}
            className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
        >
            <h2>Edit "{recipeName}"</h2>
            <ul>
            {ingredientsCopy.map((ingredient) => (
                <EditableIngredient
                    ingredientName={ingredient[0]}
                    ingredientQuantity={ingredient[1]}
                    ingredientMeasurement={ingredient[2]}
                    onDelete={handleDeleteIngredient}
                    onChange={handleInputChange}    
                    onSaveIngredient={handleUpdateIngredient}
                />
            ))}
            </ul>
            {!isAddingIngredient && (
                <button onClick={handleStartAddIngredient}>Add Ingredient</button>
            )}
            {isAddingIngredient && (
                <form>
                    <br />
                    {errorMessage !== '' && (
                        <p>{errorMessage}</p>
                    )}
                    <label>Name:</label>
                    <input 
                        label="name"
                        type="name"
                        name="name"
                        id="name"
                        onChange={(event) => handleInputChange('name', event.target.value)}
                        value={enteredIngredientValues.name}
                    />
                    <label>Quantity:</label>
                    <input 
                        label="quantity"
                        name="quantity"
                        id="quantity" 
                        type="number"
                        onChange={(event) => handleInputChange('quantity', event.target.value)}
                        value={enteredIngredientValues.quantity} 
                    />
                    <br />
                    <label>Measurement:</label>
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
                    <button type="button" onClick={handleCancelAddIngredient}>Cancel</button>
                    <button type="button" onClick={() => handleAddIngredient()}>Add</button>
                </form>
            )}
            <form method="dialog" className="mt-4 text-right">
                <button onClick={onCancel}>{cancelButtonCaption}</button>
                {hasEdited && (
                    <button onClick={() => handleSaveChanges()}>{proceedButtonCaption}</button>
                )}
            </form>
        </dialog>,
        document.getElementById('modal-root')
    );
});

export default EditRecipeModal;