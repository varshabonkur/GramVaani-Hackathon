import React from 'react';

function Heatmap({ complaints }) {
  const villageStats = complaints.reduce((acc, complaint) => {
    if (!acc[complaint.village]) {
      acc[complaint.village] = { total: 0, urgent: 0 };
    }
    acc[complaint.village].total++;
    if (complaint.urgency === 'High') acc[complaint.village].urgent++;
    return acc;
  }, {});

  const getColor = (total) => {
    if (total === 0) return '#ebedf0';
    if (total <= 2) return '#9be9a8';
    if (total <= 4) return '#40c463';
    if (total <= 6) return '#30a14e';
    return '#216e39';
  };

  return (
    <div className="heatmap">
      <h3>📍 Village Heatmap</h3>
      <div className="village-grid">
        {Object.entries(villageStats).map(([village, stats]) => (
          <div 
            key={village}
            className="village-card"
            style={{
              backgroundColor: getColor(stats.total),
              color: stats.total > 4 ? 'white' : '#1f2937'
            }}
          >
            <strong>{village}</strong>
            <div>Total: {stats.total}</div>
            <div style={{ fontSize: '0.8rem' }}>
              ⚡ {stats.urgent} urgent
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Heatmap;