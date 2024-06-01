import React from 'react';
import { useSelector } from 'react-redux';
import { useState, useEffect, useContext } from 'react'
import './App.css'

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

import Authentication from './components/Authentication.jsx';
import Dashboard from './components/Dashboard.jsx';
import Account from './components/Account.jsx';
import AddRecipe from './components/AddRecipe.jsx';
import UserRecipes from './components/UserRecipes.jsx';
import GenerateList from './components/GenerateList.jsx';
import UserRecipesRecipe from './components/UserRecipesRecipe';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([

  { path: '/', element: <Authentication /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/account', element: <Account /> },
  { path: '/addrecipe', element: <AddRecipe /> },
  { 
    path: '/myrecipes', 
    element: <UserRecipes />,
    children: [
      { path: '/myrecipes/recipedetails', element: <UserRecipesRecipe /> },
    ]
  },
  { path: '/generatelist', element: <GenerateList /> },

]);

import { authenticationActions } from './store';

import AuthProvider from './context/AuthContext.jsx';


function App() {

  return (
    <RouterProvider router={router} /> 
  )

}

export default App;
