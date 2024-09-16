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
        {/* InputLabel provides an accessible label for the Select component */}
        <InputLabel id="filter-events-label">Filter Events</InputLabel>
        
        {/* The Select is linked to the InputLabel via the labelId */}
        <Select
          labelId="filter-events-label"
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Filter Events by Category"
        >
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
