import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import tokenService from '../services/tokenService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = tokenService.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name,
                    fullName: payload.FullName,
                    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role,
                });
            } catch {
                tokenService.removeToken();
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (username, password) => {
        const response = await authService.login(username, password);
        if (response.token) {
            tokenService.setToken(response.token);
            setUser({
                username: response.username,
                fullName: response.fullName,
                role: response.role,
            });
        }
        return response;
    }, []);

    const logout = useCallback(() => {
        tokenService.removeToken();
        setUser(null);
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
