import React, { useState } from 'react';
import './Trading.css';
import './Modal.css';
import Leaderboard from './Leaderboard';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Helper to process raw orders into a structured order book
const buildOrderBook = (orders) => {
    const book = {};
    orders.forEach(order => {
        const price = parseFloat(order.price).toFixed(2);
        if (!book[price]) {
            book[price] = { buy: 0, sell: 0, buyOrders: [], sellOrders: [] };
        }
        if (order.type === 'buy') {
            book[price].buy += order.amount;
            book[price].buyOrders.push(order);
        } else {
            book[price].sell += order.amount;
            book[price].sellOrders.push(order);
        }
    });

    return Object.keys(book)
        .map(price => ({ price, ...book[price] }))
        .sort((a, b) => b.price - a.price);
};

const Trading = ({ currentUser, allPlayers, limitOrders, addLimitOrder }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderType, setOrderType] = useState('buy');
    const [orderPrice, setOrderPrice] = useState('');

    const { id, name, pnl, positions } = currentUser;
    const rank = [...allPlayers].sort((a, b) => (b.pnl || 0) - (a.pnl || 0)).findIndex(p => p.id === id) + 1;

    const openOrderModal = (type) => {
        setOrderType(type);
        setIsModalOpen(true);
    };

    const handlePlaceLimitOrder = () => {
        // Amount is now fixed to 1
        if (parseFloat(orderPrice) > 0) {
            addLimitOrder({
                id: `order_${Date.now()}`, // Unique ID for the order
                type: orderType,
                price: parseFloat(orderPrice),
                amount: 1, // Amount is always 1
                user: id
            });
            setOrderPrice('');
            setIsModalOpen(false);
        } else {
            alert("Please enter a valid price.");
        }
    };

    const handleTradeExecution = async (price, type) => {
        if (positions.length >= 5) {
            alert("You can have at most 5 open positions.");
            return;
        }

        const newPosition = {
            type: type === 'buy' ? 'LONG' : 'SHORT',
            entryPrice: parseFloat(price),
            id: `pos_${Date.now()}`
        };
        
        const userDocRef = doc(db, "users", id);
        try {
            await updateDoc(userDocRef, {
                positions: arrayUnion(newPosition),
                pnl: (pnl || 0) - 0.10 // Transaction cost
            });
            // Here you would also update the order book state by removing the filled order
        } catch (error) {
            console.error("Error executing trade: ", error);
        }
    };
    
    const closePosition = async (positionToClose) => {
        const exitPrice = positionToClose.type === 'LONG' 
            ? parseFloat(buildOrderBook(limitOrders).find(o => o.buy > 0)?.price || positionToClose.entryPrice)
            : parseFloat(buildOrderBook(limitOrders).find(o => o.sell > 0)?.price || positionToClose.entryPrice);

        const profit = positionToClose.type === 'LONG' 
            ? exitPrice - positionToClose.entryPrice
            : positionToClose.entryPrice - exitPrice;
            
        const userDocRef = doc(db, "users", id);
        try {
            await updateDoc(userDocRef, {
                positions: arrayRemove(positionToClose),
                pnl: (pnl || 0) + profit
            });
        } catch(error) {
            console.error("Error closing position: ", error);
        }
    };


    const displayedOrderBook = buildOrderBook(limitOrders);

    return (
        <div className="trading-container">
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Place {orderType === 'buy' ? 'Buy' : 'Sell'} Limit Order</h2>
                        <input type="number" placeholder="Price" value={orderPrice} onChange={(e) => setOrderPrice(e.target.value)} className="modal-input"/>
                        <div className="modal-actions">
                            <button onClick={handlePlaceLimitOrder} className={`btn ${orderType}-btn`}>Place Order</button>
                            <button onClick={() => setIsModalOpen(false)} className="btn cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="header">
                 <div className="pnl-section"><span className="pnl-label">PNL</span><span className={`pnl-value ${pnl >= 0 ? 'positive' : 'negative'}`}>{pnl.toFixed(2)}</span></div>
                 <div className="user-section"><span className="user-name">{name}</span></div>
                <div className="rank-section"><span className="rank-label">Rank</span><span className="rank-value">#{rank || '-'}</span></div>
            </div>

            <div className="positions-container">
                <h4 className="positions-title">Your Positions ({positions.length}/5)</h4>
                <div className="positions-list">
                    {positions && positions.length > 0 ? positions.map((pos) => (
                        <div key={pos.id} className={`position-item ${pos.type.toLowerCase()}`} onClick={() => closePosition(pos)}>
                           Close {pos.type} @ {pos.entryPrice.toFixed(2)}
                        </div>
                    )) : <p>No open positions</p>}
                </div>
            </div>

            <div className="order-book-container">
                <div className="order-book-header">
                    <div className="col buy-header">BUY</div>
                    <div className="col price-header">PRICE</div>
                    <div className="col sell-header">SELL</div>
                </div>
                <div className="order-book-body">
                    {displayedOrderBook.length > 0 ? displayedOrderBook.map((order, index) => (
                        <div className="order-row" key={index}>
                            <div className="col buy-orders">
                                {order.buy > 0 ? <button className="btn-order sell-btn-order" onClick={() => handleTradeExecution(order.price, 'sell')}>{order.buy}</button> : '-'}
                            </div>
                            <div className="col price">{order.price}</div>
                            <div className="col sell-orders">
                                {order.sell > 0 ? <button className="btn-order buy-btn-order" onClick={() => handleTradeExecution(order.price, 'buy')}>{order.sell}</button> : '-'}
                            </div>
                        </div>
                    )) : <p className="no-orders-message">Order book is empty.</p>}
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn limit-btn buy" onClick={() => openOrderModal('buy')}>Place Buy Limit</button>
                <button className="btn limit-btn sell" onClick={() => openOrderModal('sell')}>Place Sell Limit</button>
            </div>
            
            <Leaderboard allPlayers={allPlayers} currentUser={currentUser} />
        </div>
    );
};

export default Trading;
