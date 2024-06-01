import { createSlice, configureStore } from '@reduxjs/toolkit';


const initialAuthState = {
    currentUser: {
        'username': null,
        'email': null,
        'userId': null
    },
    userToken: null,
    error: null,
    success: false,
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login(state, payload) {
            state.currentUser = payload
        },
        register(state, payload) {
            state.currentUser = {
                'username': payload.username,
                'email': payload.email,
                'userId': payload.id
            }
        },
        logout(state) {
            state.currentUser = {
                'username': null,
                'email': null,
                'userId': null
            }
        },
    }
});

const initialRecipeSelectionState = {
    recipeIdsForShoppingList: [],
}


const recipeSelectionSlice = createSlice({
    name: 'manage recipes converted to shopping list',
    initialState: initialRecipeSelectionState,
    reducers: {
        addRecipe(state, payload) {
                state.recipeIdsForShoppingList.push(payload.payload);
            },
            

        removeRecipe(state, payload) {
            const recipeIdList = state.recipeIdsForShoppingList;
            const newIdList = recipeIdList.filter(function (recipeId) {
                return recipeId !== payload.payload;
            });
            state.recipeIdsForShoppingList = newIdList;
        },
    }
},);

const store = configureStore({
    reducer: { authentication: authenticationSlice.reducer, recipeSelection: recipeSelectionSlice.reducer },
});

export const authenticationActions = authenticationSlice.actions;
export const recipeSelectionActions = recipeSelectionSlice.actions;

export default store;
 