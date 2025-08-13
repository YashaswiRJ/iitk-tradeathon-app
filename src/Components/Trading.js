import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Trading = () => {
    const [price, setPrice] = useState(100);
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const priceInterval = setInterval(() => {
            setPrice(prevPrice => {
                const change = (Math.random() - 0.5) * 4;
                let newPrice = prevPrice + change;
                if (newPrice < 1) newPrice = 1;
                if (newPrice > 200) newPrice = 200;
                return Math.round(newPrice);
            });
        }, 1000);

        return () => clearInterval(priceInterval);
    }, []);

    useEffect(() => {
        if (userId) {
            const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
                setUserData(doc.data());
            });
            return () => unsub();
        }
    }, [userId]);

    const handleTrade = async (type) => {
        if (!userData) return;

        const currentPositions = userData.positions || [];
        if (currentPositions.length >= 5) {
            alert("You can have at most 5 open positions.");
            return;
        }
        
        const newPosition = { type, entryPrice: price };
        const updatedPositions = [...currentPositions, newPosition];

        try {
            await updateDoc(doc(db, "users", userId), { positions: updatedPositions });
        } catch (error) {
            console.error("Error updating positions: ", error);
        }
    };

    const closePosition = async (index) => {
        if (!userData) return;

        const positionToClose = userData.positions[index];
        const profit = (positionToClose.type === 'long') 
            ? price - positionToClose.entryPrice 
            : positionToClose.entryPrice - price;
        
        const newScore = userData.score + profit;
        const updatedPositions = userData.positions.filter((_, i) => i !== index);

        try {
            await updateDoc(doc(db, "users", userId), {
                score: newScore,
                positions: updatedPositions
            });
        } catch (error) {
            console.error("Error closing position: ", error);
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Welcome, {userData.name}</h2>
            <h3>Score: {userData.score.toFixed(2)}</h3>
            <h1>Current Price: {price}</h1>
            <button onClick={() => handleTrade('long')} style={{ padding: '10px 20px', margin: '5px', backgroundColor: 'green', color: 'white' }}>Bid (Long)</button>
            <button onClick={() => handleTrade('short')} style={{ padding: '10px 20px', margin: '5px', backgroundColor: 'red', color: 'white' }}>Ask (Short)</button>
            
            <div style={{ marginTop: '20px' }}>
                <h3>Your Positions</h3>
                {userData.positions && userData.positions.map((pos, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
                        <p>Type: {pos.type}</p>
                        <p>Entry Price: {pos.entryPrice}</p>
                        <button onClick={() => closePosition(index)}>Close</button>
                    </div>
                ))}
            </div>

            <Link to="/leaderboard" style={{ display: 'block', marginTop: '20px' }}>View Leaderboard</Link>
        </div>
    );
};

export default Trading;