import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) {
            navigate('/login');
        }
    }, [navigate]);

    return null;
}

export default Redirect;
