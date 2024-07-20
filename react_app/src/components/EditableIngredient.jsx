import { useState, useRef } from "react";

const measurementValues = ['tablespoon', 'teaspoon', 'milligram', 'cup', 'ounce', 'pound',
                             'gallon', 'quart', 'pint', 'liter', 'milliliter', 'count', 'gram', 'kilogram']
const sortedMeasurements = measurementValues.sort();

export default function EditableIngredient({ 
    ingredientId, 
    ingredientName, 
    ingredientQuantity,
    ingredientMeasurement,
    onSaveIngredient,
    onEdit,
    onDelete
    }) {
    const [isEditing, setIsEditing] = useState(false);
    const [enteredIngredientValues, setEnteredIngredientValues] = useState({
        name: '',
        quantity: '',
        measurement: ''
    });

    function handleInputChange(identifier, value) {
        return setEnteredIngredientValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
    }

    function handleToggleEditing() {
        setIsEditing((prevState) => !prevState);
    }

    function handleSaveIngredient() {
        const ingredient = ingredientName;
        const updatedValues = enteredIngredientValues;

        onSaveIngredient(ingredient, updatedValues);
        setIsEditing(false);
        
        return
    }

    function handleDeleteIngredient() {
        const ingredient = ingredientName;
        onDelete(ingredient);
    }

    if (!isEditing) {
        return (
            <li
                key={ingredientName}
                id={ingredientName}
            >
                {ingredientName}, {ingredientQuantity} {ingredientMeasurement}
                <button onClick={handleToggleEditing}>Edit</button>
                <button onClick={handleDeleteIngredient}>Delete</button>
            </li>
        )
    } else {
        return (
            <li key={ingredientName}>
                <form>
                    {/* <label>Enter the ingredient's name, the quantity, and the measurement</label> */}
                    <br />
                    <input 
                        label="name"
                        type="name"
                        name="name"
                        placeholder={ingredientName}
                        id="name"
                        onChange={(event) => handleInputChange('name', event.target.value)}
                        value={enteredIngredientValues.name}
                    />
                    <input 
                        label="quantity"
                        name="quantity"
                        id="quantity" 
                        placeholder={ingredientQuantity}
                        type="number"
                        onChange={(event) => handleInputChange('quantity', event.target.value)}
                        value={enteredIngredientValues.quantity} 
                    />
                    <select 
                        label="measurement"
                        name="measurement"
                        id="measurement"
                        placeholder={ingredientMeasurement}
                        onChange={(event) => handleInputChange('measurement', event.target.value)}
                        value={enteredIngredientValues.measurement}
                    >
                        <option defaultValue={ingredientMeasurement} disabled hidden></option>
                        {sortedMeasurements.map((measurement) => (
                            <option key={measurement} id={measurement} placeholder={ingredientMeasurement}>{measurement}</option>
                        ))}
                    </select>
                    <button type="button" onClick={handleToggleEditing}>Cancel</button>
                    <button type="button" onClick={handleSaveIngredient}>Save</button>
                </form>
            </li>
        );
    }
}