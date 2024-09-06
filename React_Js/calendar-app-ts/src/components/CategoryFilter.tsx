// src/components/CategoryFilter.tsx

import React, { useState } from 'react';
import { Select, MenuItem, Box, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface CategoryFilterProps {
  categoryColors: Record<string, string>;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categoryColors, onChange }) => {
  const[selectedCategory, setSelectedCategory] = useState<string>('All');
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onChange(value);
  };

  return (
    <Box>
        <FormControl fullWidth>
            <InputLabel>Filter Events</InputLabel>
      <Select
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
