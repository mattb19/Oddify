// src/Home.js
import React from 'react';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to Our Website!</h1>
            <p>This is a simple home page.</p>
            <p>Explore our features and enjoy your stay!</p>
            <button onClick={() => alert('Welcome!')}>Get Started</button>
        </div>
    );
};

export default Home;
