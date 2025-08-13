import React from 'react';
import './Admin.css';

const Admin = ({ players }) => {
    const sortedPlayers = [...players].sort((a, b) => b.pnl - a.pnl);

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Panel</h1>
            <div className="player-table-container">
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>PNL</th>
                            <th>Open Positions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.length > 0 ? sortedPlayers.map((player, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{player.name}</td>
                                <td className={player.pnl >= 0 ? 'positive' : 'negative'}>
                                    {player.pnl.toFixed(2)}
                                </td>
                                <td>{player.positions.length}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4">No players have joined yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
