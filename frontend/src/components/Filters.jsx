import React from 'react';

function Filters({ villages, categories, selectedVillage, selectedCategory, onVillageChange, onCategoryChange }) {
  return (
    <div className="filters">
      <select 
        className="filter-select"
        value={selectedVillage}
        onChange={(e) => onVillageChange(e.target.value)}
      >
        <option value="All">All Villages</option>
        {villages.map(village => (
          <option key={village} value={village}>{village}</option>
        ))}
      </select>

      <select 
        className="filter-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="All">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
}

export default Filters;