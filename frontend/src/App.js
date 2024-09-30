import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PokerTable from './PokerTable';
import Login from './Login'; 
import Home from './Home';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider

const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();
    // return user ? element : <Navigate to="/login" />;
    return element;
};

const App = () => {
    return (
        <AuthProvider> {/* Wrap Router with AuthProvider */}
            <Router>
                <Routes>
                    <Route path="/poker" element={<ProtectedRoute element={<PokerTable />} />} />
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/home" element={<Home />} />             
                    {/* Other routes can be added here */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;