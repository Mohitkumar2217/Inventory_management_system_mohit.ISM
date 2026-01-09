import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize state from localStorage immediately
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('pos-user');
        return storedUser ? JSON.parse(storedUser) : null;  
    });
    
    const [token, setToken] = useState(() => {
        return localStorage.getItem('pos-token') || null;
    });

    const [loading, setLoading] = useState(true);

    // 2. Simple check to verify auth status on load
    useEffect(() => {
        if (token && user) {
            // Optional: You could verify the token with an API call here
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token, user]);

    const login = (authToken, userData) => {
        // Sync state
        setToken(authToken);
        setUser(userData);
        
        // Sync storage
        localStorage.setItem('pos-token', authToken);
        localStorage.setItem('pos-user', JSON.stringify(userData));
    };

    const logout = () => {
        // Clear state
        setToken(null);
        setUser(null);
        
        // Clear storage
        localStorage.removeItem('pos-token');
        localStorage.removeItem('pos-user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};