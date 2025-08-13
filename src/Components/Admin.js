import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            const unsub = onSnapshot(collection(db, "users"), (querySnapshot) => {
                const usersData = [];
                querySnapshot.forEach((doc) => {
                    usersData.push({ id: doc.id, ...doc.data() });
                });
                setUsers(usersData);
            });
            return () => unsub();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        // IMPORTANT: This is a very simple password check.
        // For a real event, consider a more secure method.
        if (password === 'iitkmathsclub') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        style={{ padding: '10px', width: '80%', maxWidth: '300px', marginBottom: '10px' }}
                    />
                    <br />
                    <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Panel</h1>
            <h2>All Users</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Open Positions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.score.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.positions ? user.positions.length : 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
