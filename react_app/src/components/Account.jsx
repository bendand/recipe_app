import { useSelector } from "react-redux";

import { Link, useNavigate } from 'react-router-dom';

export default function Account() {
    const currentUser = useSelector(state => state.currentUser.payload);

    if (currentUser === undefined) {
        alert('your session has expired, you are being redirected to the homepage');
        navigate('/');
    }

    return (
        <div>
            <p><strong>{currentUser['email']}'s account</strong></p>
            <p>shopping with us since </p>
            <p></p>
        </div>
    )
}