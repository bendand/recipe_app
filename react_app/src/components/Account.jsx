import { useSelector } from "react-redux";

import { Link, useNavigate, Outlet } from 'react-router-dom';

export default function Account() {
    const currentUser = useSelector(state => state.currentUser.payload);

    if (currentUser === undefined) {
        alert('your session has expired, you are being redirected to the homepage');
        navigate('/');
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
            <div>
                <p><strong>{currentUser['username']}'s account</strong></p>
                <p>shopping with us since </p>
                <p></p>
            </div>
        </>
    );
}