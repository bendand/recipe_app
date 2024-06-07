import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";

import { useEffect, useRef } from "react";

import { Link, useNavigate, Outlet } from 'react-router-dom';

import { authenticationActions } from '../store/index.js';

export default function Account() {
    const currentUser = useSelector(state => state.authentication.currentUser.payload);

    const username = currentUser.username;

    const modal = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === undefined) {
            alert('your session has expired, you are being redirected to the homepage');
            navigate('/');
        }
    }, [])

    function handleStartLogout() {
        modal.current.open();
    }

    function handleCancelLogOut() {
        modal.current.close();
    }

    function handleLogOut() {
        dispatch(authenticationActions.logout());
        navigate('/');
    }

    

    return (
        <>
            <Modal
                ref={modal}
                proceedButtonCaption="Log me out"
                cancelButtonCaption="Cancel"
                onCancel={handleCancelLogOut}
                onProceed={handleLogOut}
            >
                Are you sure you want to log out?
            </Modal>
            <nav>
                <Link to="/account" className='nav-element'>Account</Link>
                <Link to="/addrecipe" className='nav-element'>Add a Recipe</Link>
                <Link to="/myrecipes" className='nav-element'>My Recipes</Link>
                <Outlet />
                <Link to="/generatelist" className='nav-element'>Generate Shopping List</Link>
            </nav>
            <div>
                <p><strong>{username}'s account</strong></p>
                <button onClick={() => handleStartLogout()}>Log Out</button>
            </div>
        </>
    );
}