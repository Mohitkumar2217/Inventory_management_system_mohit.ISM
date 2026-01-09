import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireRole }) => {
    const { user, loading } = useAuth(); //
    const navigate = useNavigate();

    useEffect(() => { 
        if (!loading) {
            if (!user) { 
                navigate("/login");
            } else if (requireRole && !requireRole.includes(user.role)) { 
                navigate("/unauthorized");
            }
        }
    }, [user, loading, navigate, requireRole]);
 
    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }
 
    return (user && (!requireRole || requireRole.includes(user.role))) ? children : null;
};

export default ProtectedRoute;