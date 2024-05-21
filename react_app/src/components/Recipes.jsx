import { useState, useEffect } from 'react';

export default function Recipes({ title, recipes, isLoading, loadingText, fallbackText }) {
    const [count, setCount] = useState(0);
    // const [recipes, setRecipes] = useState([]);


    const fetchAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8000/users/<username>");
        console.log(response.data.recipes);
        setArray(response.data.recipes);
    }

    useEffect(() => {
        fetchAPI();
    })

    return (
        <div>
            <h3>{title}</h3>
            {isLoading && <p>{loadingText}</p>}
            {!isLoading && recipes.length === 0 && <p>{fallbackText}</p>}
            <ul>
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <span>{recipe}</span>
                        <button onClick={() => handleSelectRecipe(recipe)}>View Recipe</button>
                        <br></br>
                    </div>
                ))}
            </ul>
        </div>
    );
}