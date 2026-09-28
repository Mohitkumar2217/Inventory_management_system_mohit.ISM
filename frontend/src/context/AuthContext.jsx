import { createContext, useState, useContext, useEffect } from "react";
import apiClient, {
    refreshAccessToken,
    setAccessToken,
    setSessionExpiredHandler,
    setSessionRefreshedHandler
} from "../api/client.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize state from localStorage immediately
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('pos-user');
        return storedUser ? JSON.parse(storedUser) : null;  
    });
    
    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        localStorage.removeItem("pos-token");
        const clearSession = () => {
            setAccessToken(null);
            setToken(null);
            setUser(null);
            localStorage.removeItem("pos-user");
        };

        setSessionExpiredHandler(clearSession);
        setSessionRefreshedHandler(session => {
            if (!active) return;
            setToken(session.accessToken);
            setUser(session.user);
            localStorage.setItem("pos-user", JSON.stringify(session.user));
        });
        refreshAccessToken()
            .then(session => {
                if (!active) return;
                setToken(session.accessToken);
                setUser(session.user);
                localStorage.setItem("pos-user", JSON.stringify(session.user));
            })
            .catch(() => {
                if (active) clearSession();
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
            setSessionExpiredHandler(() => {});
            setSessionRefreshedHandler(() => {});
        };
    }, []);

    const login = (accessToken, userData) => {
        setAccessToken(accessToken);
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem('pos-user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch {
            // Clear local session even if the server is unreachable.
        }
        setAccessToken(null);
        setToken(null);
        setUser(null);
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