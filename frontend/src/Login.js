import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider

const Login = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            await login(username); 
            navigate('/home')
        } catch (error) {
            setError('Error during login. Please try again.');
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Username:
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error */}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
