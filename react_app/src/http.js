

export async function fetchUserRecipes() {
    const response = await fetch('http://127.0.0.1:8000/users/<username>');
    const resData = response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }

    return resData.recipes;
}


export async function updateUserRecipes() {
    const response = await fetch('http://127.0.0.1:8000/recipes/<int:recipe_id>/update');
    const resData = response.json();

    if (!response.ok) {
        throw new Error('Failed to update recipes')
    }

    return resData.recipes;
}