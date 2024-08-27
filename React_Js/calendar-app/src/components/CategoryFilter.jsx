import React, { useState } from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { categoryColors } from '../utils/categoryColors';


const CategoryFilter = ({ onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onChange(e.target.value);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Select
        fullWidth
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <MenuItem value="All">All</MenuItem>
        {Object.keys(categoryColors).map((cat) => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CategoryFilter;
