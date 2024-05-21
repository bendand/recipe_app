import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

export default function GenerateList() {
    const currentUser = useSelector(state => state.currentUser.payload);

    if (currentUser === undefined) {
        alert('your session has expired, you are being redirected to the homepage');
        navigate('/');
    }

    return (
        <h2></h2>
    )
}