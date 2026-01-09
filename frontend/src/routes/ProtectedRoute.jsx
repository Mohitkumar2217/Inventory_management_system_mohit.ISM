import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireRole }) => {
    const { user, loading } = useAuth(); //
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for the AuthProvider to finish checking localStorage
        if (!loading) {
            if (!user) {
                // If no user found, force redirect to login
                navigate("/login");
            } else if (requireRole && !requireRole.includes(user.role)) {
                // If user exists but role is wrong, go to unauthorized
                navigate("/unauthorized");
            }
        }
    }, [user, loading, navigate, requireRole]);

    // Prevent "flashing" of private content while loading
    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Only render the children (Dashboard) if user is verified
    return (user && (!requireRole || requireRole.includes(user.role))) ? children : null;
};

export default ProtectedRoute;