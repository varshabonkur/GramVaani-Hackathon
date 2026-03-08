import React, { useState, useEffect } from 'react';
import './App.css';
import StatsCards from './components/StatsCards';
import ComplaintsTable from './components/ComplaintsTable';
import Heatmap from './components/Heatmap';
import CategoryChart from './components/CategoryChart';
import Filters from './components/Filters';
import { fetchComplaints, fetchStats } from './api';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique villages and categories from data
  const villages = ['All', ...new Set(complaints.map(c => c.village))];
  const categories = ['All', ...new Set(complaints.map(c => c.category))];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, statsData] = await Promise.all([
        fetchComplaints(),
        fetchStats()
      ]);
      
      console.log('Complaints:', complaintsData);
      console.log('Stats:', statsData);
      
      setComplaints(complaintsData || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (selectedVillage !== 'All' && c.village !== selectedVillage) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    return true;
  });

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading GramVaani dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <h3>⚠️ Error</h3>
      <p>{error}</p>
      <button onClick={loadData}>Retry</button>
    </div>
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>📢 GramVaani</h1>
        <p className="tagline">Voice of the Village - Dashboard</p>
      </header>

      <div className="dashboard">
        <Filters 
          villages={villages}
          categories={categories}
          selectedVillage={selectedVillage}
          selectedCategory={selectedCategory}
          onVillageChange={setSelectedVillage}
          onCategoryChange={setSelectedCategory}
        />

        <StatsCards complaints={filteredComplaints} />

        <div className="row">
          <Heatmap complaints={filteredComplaints} />
          <CategoryChart complaints={filteredComplaints} />
        </div>

        <ComplaintsTable complaints={filteredComplaints} />
      </div>
    </div>
  );
}

export default App;