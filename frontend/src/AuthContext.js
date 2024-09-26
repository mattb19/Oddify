// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("");

    // useEffect(() => {
    //     let isMounted = true;

    //     const checkAuthStatus = async () => {
    //         try {
    //             const response = await fetch('http://localhost:4000/api/auth/status', {
    //                 credentials: 'include',
    //             });
    //             const data = await response.json();
    //             if (isMounted && data.loggedIn) {
    //                 console.log("User logged in!");
    //             }
    //         } catch (error) {
    //             console.error('Failed to check auth status:', error);
    //         }
    //     };

    //     checkAuthStatus();

    //     return () => {
    //         console.log(user);
    //         isMounted = false; // Cleanup function
    //     };
    // }, []);

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
