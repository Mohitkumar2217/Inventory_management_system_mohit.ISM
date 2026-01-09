import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            }
            else {
                navigate('/login');
            }
        }
    }, [user, navigate]);

    return (
        <Dashboard />
    );
}   

export default Root;