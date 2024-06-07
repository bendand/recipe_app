import { Link } from 'react-router-dom';

export default function Authentication() {

    return (
        <div>
            <nav>
                <Link to="/login" className='nav-element'>Login</Link>
                <Link to="/register" className='nav-element'>Register</Link>
            </nav>
            <div>
                <h1><strong>The Shopping List</strong></h1>
                <p>The Shopping List turns your cluttered recipes into one condensed shopping list.</p>
            </div>
        </div>
    )
    
}