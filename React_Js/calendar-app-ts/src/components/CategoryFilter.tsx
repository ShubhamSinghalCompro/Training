// src/components/CategoryFilter.tsx

import React, { useState } from 'react';
import { Select, MenuItem, Box, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Category } from '../utils/types';
import { categoryColors } from '../utils/categoryColors';

interface CategoryFilterProps {
  onChange: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onChange }) => {
  const[selectedCategory, setSelectedCategory] = useState<Category>('All');
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as Category;
    setSelectedCategory(value);
    onChange(value);
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
        {/* <MenuItem value="All">All</MenuItem> */}
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
