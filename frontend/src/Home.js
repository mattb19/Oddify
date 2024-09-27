// src/Home.js
import React from 'react';
import { useAuth } from './AuthContext';

const Home = () => {
    const { user } = useAuth();
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to Our Website, { user }!</h1>
            <p>This is a simple home page.</p>
            <p>Explore our features and enjoy your stay!</p>
            <button onClick={() => alert('Welcome!')}>Get Started</button>
        </div>
    );
};

export default Home;
