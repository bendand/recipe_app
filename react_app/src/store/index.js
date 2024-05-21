import { createSlice, configureStore } from '@reduxjs/toolkit';


const initialState = {
    currentUser: {
        'username': null,
        'email': null,
        'userId': null
    },
    userToken: null,
    error: null,
    success: false
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
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

const store = configureStore({
    reducer: authenticationSlice.reducer
});

export const authenticationActions = authenticationSlice.actions;
export default store;
 