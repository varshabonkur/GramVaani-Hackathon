import React from 'react';

function CategoryChart({ complaints }) {
  const categories = ['Water', 'Road', 'Electricity', 'Sanitation'];
  const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71'];
  
  const counts = categories.map(cat => 
    complaints.filter(c => c.category === cat).length
  );
  
  const total = complaints.length;

  return (
    <div className="chart-container">
      <h3>📊 Issues by Category</h3>
      <div style={{ marginTop: '1rem' }}>
        {categories.map((cat, index) => {
          const count = counts[index];
          const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
          
          return (
            <div key={cat} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>{cat}</span>
                <span>{count} ({percentage}%)</span>
              </div>
              <div style={{ 
                height: '20px', 
                backgroundColor: '#ecf0f1',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: colors[index],
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChart;
