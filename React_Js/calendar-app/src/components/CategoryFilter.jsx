import React, { useState } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { categoryColors } from '../utils/categoryColors';


const CategoryFilter = ({onChange}) => {
  const[selectedCategory, setSelectedCategory] = useState('All');
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Box sx={{ mb: 2 }}>
        <FormControl fullWidth  sx={{ mb: 2 }}>
            <InputLabel>Filter Events</InputLabel>
      <Select
        fullWidth
        value={selectedCategory}
        onChange={handleCategoryChange}
        label="Filter Events"
      >
        <MenuItem value="All">All</MenuItem>
          {Object.keys(categoryColors).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
        ))}
      </Select>
    </FormControl>
    </Box>
  );
};

export default CategoryFilter;
