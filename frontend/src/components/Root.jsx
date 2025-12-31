import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            }
            else if (user.role === 'client') {
                navigate('/client/dashboard');
            }
            else if (user.role === 'staff') {
                navigate('/staff/dashboard');
            }
            else if (user.role === 'manager') {
                navigate('/manager/dashboard');
            }
            else if(user.role === 'supplier'){
                navigate('/supplier/dashboard');
            }
            else if(user.role === 'warehouse'){
                navigate('/warehouse/dashboard');
            }
            else if(user.role === 'accountant'){
                navigate('/accountant/dashboard');
            }
            else {
                navigate('/login');
            }
        }
    }, [user, navigate]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
        </div>
    );
}   

export default Root;