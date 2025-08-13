import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("score", "desc"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            const usersData = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() });
            });
            setUsers(usersData);
        });
        return () => unsub();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Leaderboard</h1>
            <ol>
                {users.map((user, index) => (
                    <li key={user.id} style={{ fontSize: '1.2em', padding: '5px' }}>
                        {user.name}: {user.score.toFixed(2)}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;