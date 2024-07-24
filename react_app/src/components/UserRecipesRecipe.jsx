import dateFormat from 'dateformat';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom';

import axios from "axios";
import Modal from './Modal';
import EditRecipeModal from './EditRecipeModal.jsx';

const measurementValues = ['tablespoon', 'teaspoon', 'milligram', 'cup', 'ounce', 'pound',
                             'gallon', 'quart', 'pint', 'liter', 'milliliter', 'count', 'gram', 'kilogram']
const sortedMeasurements = measurementValues.sort()

const getRecipeIngredientsURL = 'http://127.0.0.1:8000/recipes/viewrecipeingredients';
const deleteRecipeURL = 'http://127.0.0.1:8000/recipes/deleterecipe';

export default function UserRecipesRecipe({ name, date, id }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const deleteModal = useRef();
    const editRecipeModal = useRef();
    let recipeIdDeleting = null;

    function handleCloseEditModal() {
        editRecipeModal.current.close();
    }

    function handleUpdateIngredientList(newIngredientList) {
        setIngredients(newIngredientList);
        toast.success('Recipe updated!');        
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
                        // console.log(ingredients);
                        setIngredients(ingredients);
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
        return setIngredients([]);
    }

    function handleEditRecipe() {
        editRecipeModal.current.open();
    }

    function handleStartAddIngredient() {
        return setIsAddingIngredient((prevState) => !prevState);
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
                ref={editRecipeModal}
                ingredients={ingredients}
                recipeId={id}
                recipeName={name}
                cancelButtonCaption='Cancel'
                proceedButtonCaption='Save Changes'
                onCancel={() => handleCloseEditModal()}
                onProceed={() => handleSaveChanges()}
                updateIngredientList={handleUpdateIngredientList}
            />
            {ingredients.length === 0 && (
                <div key={id}>
                    <elem key={id}>{name}
                        <button onClick={() => handleViewRecipeDetails(id)}>View Recipe Details</button>
                    </elem> 
                </div>
            )}
            {ingredients.length !== 0 && (
                <div key={id}>
                    <span key={id}>{name}</span><button onClick={() => hideRecipeDetails()}>Hide Recipe Details</button>
                    {ingredients.map((ingredient) => (
                        <p key={ingredient[0]}>{ingredient[0]}, {ingredient[1]} {ingredient[2]}</p>
                    ))}
                    <button onClick={() => handleStartDeleteRecipe(id)}>Delete Recipe</button>
                    <button onClick={() => handleEditRecipe()}>Edit Recipe</button>
                </div>
            )}
        </>
    );
}

