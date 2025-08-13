import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Trading from './components/Trading';
import Admin from './components/Admin';
import './App.css';
import { db } from './firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [limitOrders, setLimitOrders] = useState([]); // Global state for all orders
  const [isLoading, setIsLoading] = useState(true);

  // Listener for player data
  useEffect(() => {
    const q = collection(db, "users");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData = [];
      querySnapshot.forEach((doc) => {
        playersData.push({ id: doc.id, ...doc.data() });
      });
      setAllPlayers(playersData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // This would ideally be fetched from a database as well
  // For now, we manage it in the app's state
  const addLimitOrder = (order) => {
      setLimitOrders(prevOrders => [...prevOrders, order]);
  }


  const handlePlayerLogin = (name) => {
    const loggedInUser = allPlayers.find(p => p.name === name);
    if (loggedInUser) {
        setUser(loggedInUser);
    }
  };
  
   useEffect(() => {
    if (user) {
      const updatedUser = allPlayers.find(p => p.id === user.id);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  }, [allPlayers, user]);


  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  if (isLoading) {
      return <div className="loading-screen">Loading...</div>
  }

  if (isAdmin) {
    return <Admin players={allPlayers} />;
  }

  if (user) {
    return <Trading currentUser={user} allPlayers={allPlayers} limitOrders={limitOrders} addLimitOrder={addLimitOrder} />;
  }

  return <Login onPlayerLogin={handlePlayerLogin} onAdminLogin={handleAdminLogin} />;
}

export default App;
