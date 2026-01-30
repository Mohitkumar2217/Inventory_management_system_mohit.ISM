import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth();

  // 1. Show a loader while checking auth status
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If role doesn't match, redirect to a safe place (or login)
  if (requireRole && !requireRole.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 4. Return children if used as a wrapper, or Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;