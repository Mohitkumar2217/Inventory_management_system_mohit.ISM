import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('pos-user');
        return storedUser ? JSON.parse(storedUser) : null;  
    });
    const [token, setToken] = useState(null);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('pos-user', JSON.stringify(userData));
        localStorage.setItem('pos-token', authToken);
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('pos-user');
        localStorage.removeItem('pos-token');
    };
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}           