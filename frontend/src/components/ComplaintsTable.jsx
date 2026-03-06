import React from 'react';

function ComplaintsTable({ complaints }) {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="table-container">
      <h3>📋 Recent Complaints</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Village</th>
            <th>Issue</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td><strong>{complaint.village}</strong></td>
              <td>{complaint.transcript.substring(0, 25)}...</td>
              <td>{complaint.category}</td>
              <td className={`urgency-${complaint.urgency}`}>
                {complaint.urgency}
              </td>
              <td>
                <span className={`status-badge status-${complaint.status.replace(' ', '-')}`}>
                  {complaint.status}
                </span>
              </td>
              <td>{formatDate(complaint.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintsTable;