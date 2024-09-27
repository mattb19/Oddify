// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) {
            setUser(storedUser); // Restore user from localStorage
        }
    }, []);

    const login = async (username) => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.username);
                localStorage.setItem('username', data.username);
                return data.username;
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                throw new Error(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Optionally rethrow or handle error
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('username'); // Remove username from localStorage
        try {
            await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
