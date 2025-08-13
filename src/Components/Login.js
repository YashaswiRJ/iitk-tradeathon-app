import React, { useState } from 'react';
import './Login.css';
import { db } from '../firebase'; // Assuming firebase config is in 'firebase.js'
import { doc, setDoc } from 'firebase/firestore';

const Login = ({ onPlayerLogin, onAdminLogin }) => {
    const [view, setView] = useState('player'); // 'player' or 'admin'
    const [fullName, setFullName] = useState('');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [error, setError] = useState('');

    const handlePlayerSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = fullName.trim();
        if (!trimmedName) {
            setError('Please enter your full name.');
            return;
        }

        const userId = trimmedName.toLowerCase().replace(/\s+/g, '_');

        try {
            // Create a new user document in Firestore
            await setDoc(doc(db, "users", userId), {
                name: trimmedName,
                pnl: 0, // Start with 0 PNL
                positions: []
            });
            // Lift the state up to App.js
            onPlayerLogin(trimmedName);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError('Failed to login. Please try again.');
        }
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        // Hardcoded admin credentials
        if (adminUser === 'admin' && adminPass === 'password123') {
            onAdminLogin();
        } else {
            setError('Invalid admin credentials.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Trad-a-thon</h1>
            {view === 'player' ? (
                <form onSubmit={handlePlayerSubmit} className="login-form">
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter Your Full Name"
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Join Game</button>
                    <p className="switch-view" onClick={() => { setView('admin'); setError(''); }}>
                        Login as Admin
                    </p>
                </form>
            ) : (
                <form onSubmit={handleAdminSubmit} className="login-form">
                    <input
                        type="text"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="Admin Username"
                        className="login-input"
                    />
                    <input
                        type="password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="Admin Password"
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Admin Login</button>
                     <p className="switch-view" onClick={() => { setView('player'); setError(''); }}>
                        Login as Player
                    </p>
                </form>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
