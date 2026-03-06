import React from 'react';

function StatsCards({ complaints }) {
  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    urgent: complaints.filter(c => c.urgency === 'High').length,
    villages: [...new Set(complaints.map(c => c.village))].length
  };

  return (
    <div className="stats-grid">
      <div className="card">
        <h3>Total Complaints</h3>
        <p>{stats.total}</p>
      </div>
      <div className="card">
        <h3>Open</h3>
        <p>{stats.open}</p>
      </div>
      <div className="card urgent">
        <h3>Urgent</h3>
        <p>{stats.urgent}</p>
      </div>
      <div className="card">
        <h3>Villages</h3>
        <p>{stats.villages}</p>
      </div>
    </div>
  );
}

export default StatsCards;