import React, { useState } from 'react';
import './App.css';
import { mockComplaints, villages, categories } from './utils/mockData';
import StatsCards from './components/StatsCards';
import ComplaintsTable from './components/ComplaintsTable';
import Heatmap from './components/Heatmap';
import CategoryChart from './components/CategoryChart';
import Filters from './components/Filters';

function App() {
  const [complaints] = useState(mockComplaints);
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredComplaints = complaints.filter(c => {
    if (selectedVillage !== 'All' && c.village !== selectedVillage) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    return true;
  });

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