import { Link, useNavigate, Outlet } from 'react-router-dom';

import GenerateListRecipe from './GenerateListRecipe';

import axios from "axios";

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

const generateListURL = 'http://127.0.0.1:8000/users/myrecipes/generatelist';


export default function GenerateList() {
    const currentUser = useSelector(state => state.authentication.currentUser.payload);
    const recipeIdList = useSelector(state => state.recipeSelection.recipeIdsForShoppingList);

    const [userRecipes, setUserRecipes] = useState([]);
    const [shoppingListIngredients, setShoppingListIngredients] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
            return
        }

        // if (recipeIdList === undefined) {
        //     console.log('recipeIdList is undefined');
        // } else {
        //     console.log('recipe id list: ' + recipeIdList.entries());
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

            return
        }

        fetchUserRecipesAPI();
    }, [])

    

    function handleSubmitRecipes(event) {
        event.preventDefault();

        const addRecipesToShoppingListAPI = () => {
            try {
                axios.post(generateListURL, {
                    recipeIds: recipeIdList  
                })
                .then(function (response) {
                    const reducedIngredients = response.data.ingredients_reduced;
                    setShoppingListIngredients(reducedIngredients);
                })
            } catch (error) {
                console.log(error);
                alert('request failed');
            }

            return
        }

        addRecipesToShoppingListAPI();
        
    }
        

    return (
        <>
            <nav>
                <Link to="/logout" className='nav-element'>Log Out</Link> 
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                <Outlet />
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            {shoppingListIngredients === null ? (
                <div>
                    <h4>choose recipes to add to your shopping list</h4>
                    <form id='recipe-list' name='recipe-list'>
                        <ul>
                            {userRecipes.map((recipe) => (
                                <div key={recipe.id}>
                                    <GenerateListRecipe
                                        id={recipe.id}
                                        name={recipe.name}
                                        date={recipe.date}
                                        key={recipe.id}
                                        onClick={() => toggleCheckboxClick(recipe.id)}
                                        />
                                </div>
                            ))}
                        </ul>
                        <button onClick={handleSubmitRecipes}>make my shopping list!</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h4>my shopping list</h4>
                    {shoppingListIngredients.map((ingredient) => (
                        <li key={[ingredient[0], ingredient[2]]}>{ingredient[0]} {ingredient[1]} {ingredient[2]}</li>
                    ))}
                </div>
            )}
        </>
    );
}