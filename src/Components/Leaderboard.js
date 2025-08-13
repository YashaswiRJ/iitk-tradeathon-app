import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ allPlayers, currentUser }) => {
    // Sort players from props by PNL in descending order
    const sortedPlayers = [...allPlayers].sort((a, b) => (b.pnl || 0) - (a.pnl || 0));

    return (
        <div className="leaderboard-container">
            <h3 className="leaderboard-title">Leaderboard</h3>
            <ul className="leaderboard-list">
                {sortedPlayers.length > 0 ? sortedPlayers.map((player, index) => {
                    // Defensive check: Use 0 as a fallback for PNL if it's undefined or null.
                    const playerPnl = player.pnl || 0;
                    
                    return (
                        <li key={player.id} className={`leaderboard-item ${currentUser && player.name === currentUser.name ? 'current-user' : ''}`}>
                            <span className="leaderboard-rank">{index + 1}</span>
                            <span className="leaderboard-name">{player.name}</span>
                            <span className={`leaderboard-pnl ${playerPnl >= 0 ? 'positive' : 'negative'}`}>
                                {playerPnl.toFixed(2)}
                            </span>
                        </li>
                    );
                }) : (
                    <li className="no-players">No players have joined yet.</li>
                )}
            </ul>
        </div>
    );
};

export default Leaderboard;
