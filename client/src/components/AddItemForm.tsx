import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Grid,
  Zoom,
} from '@mui/material';
import { Add as AddIcon, ShoppingCart } from '@mui/icons-material';
import { Category, ShoppingItem } from '@/types';

interface AddItemFormProps {
  categories: Category[];
  onAddItem: (item: Omit<ShoppingItem, 'quantity'> & { quantity?: number }) => void;
  loading: boolean;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  categories,
  onAddItem,
  loading,
}) => {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && selectedCategory) {
      onAddItem({
        name: itemName.trim(),
        category: selectedCategory,
      });
      setItemName('');
      setSelectedCategory('');
    }
  };

  return (
    <Zoom in timeout={600}>
      <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCart color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            הוספת מוצר חדש
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="שם המוצר"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                disabled={loading}
                placeholder="לדוגמה: חלב, לחם, בננות..."
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="קטגוריה"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!itemName.trim() || !selectedCategory || loading}
                startIcon={<AddIcon />}
                sx={{ mt: 1, py: 1.5 }}
              >
                הוסף לרשימה
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Zoom>
  );
};