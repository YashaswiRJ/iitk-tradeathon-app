import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (name.trim() === '') {
            alert('Please enter your full name.');
            return;
        }
        const userId = name.trim().toLowerCase().replace(/\s+/g, '_');
        
        try {
            await setDoc(doc(db, "users", userId), {
                name: name.trim(),
                score: 1000, // Starting score
                positions: []
            });
            localStorage.setItem('userId', userId);
            navigate('/trading');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to login. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>IITK Trade-a-thon</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ padding: '10px', width: '80%', maxWidth: '300px', marginBottom: '10px' }}
                />
                <br />
                <button type="submit" style={{ padding: '10px 20px' }}>Join Game</button>
            </form>
        </div>
    );
};

export default Login;
