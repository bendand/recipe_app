import { useSelector } from "react-redux";

import axios from "axios";

const userRecipesURL = 'http://127.0.0.1:8000/users/myrecipes';

export async function fetchUserRecipes() {

    const currentUser = useSelector(state => state.authentication.currentUser.payload);

    try {
        const response = await fetch(userRecipesURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: {
                userId: currentUser.userId
            }
        });
        if (!response.ok) {
            throw new Error('failed to fetch recipes');
        }
        const resData = await response.json();
    } catch (error) {
        console.log(error.message)
    }

    return resData
}

// const fetchUserRecipesAPI = () => {
//         console.log('getrecipeAPI triggered');
//         try {
//             axios.get(userRecipesURL, {
//                 params: {
//                     userId: currentUser.userId
//                 }
//             })
//             .then(function (response) {
//                 if (response.status === 204) {
//                     console.log(response.data);
//                 } else if (response.status === 200) {
//                     const recipes = response.data;
//                     const recipesToJSON = recipes.
//                     console.log(recipes);
//                 }
//             })
