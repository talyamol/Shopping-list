import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box } from '@mui/material';
import { RootState, AppDispatch } from '@/store';
import { addItem, updateItemQuantity, removeItem, saveOrder } from '../store/shoppingListSlice';
import { ShoppingItem } from '@/types';
import { AddItemForm } from './AddItemForm';
import { ShoppingListDisplay } from './ShoppingListDisplay';
import { TotalItemsCard } from './TotalItemsCard';
import { SaveOrderButton } from './SaveOrderButton';

export const ShoppingListTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalItems, categories, loading } = useSelector(
    (state: RootState) => state.shoppingList
  );

  const handleAddItem = (newItem: Omit<ShoppingItem, 'quantity'> & { quantity?: number }) => {
    const item: ShoppingItem = {
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: newItem.quantity || 1,
    };
    dispatch(addItem(item));
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    dispatch(updateItemQuantity({ index, quantity }));
  };

  const handleRemoveItem = (index: number) => {
    dispatch(removeItem(index));
  };

  const handleSaveOrder = () => {
    if (items.length > 0) {
      dispatch(saveOrder(items));
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TotalItemsCard totalItems={totalItems} />
        </Grid>

        <Grid item xs={12} md={6}>
          <AddItemForm
            categories={categories}
            onAddItem={handleAddItem}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ShoppingListDisplay
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </Grid>

        {items.length > 0 && (
          <Grid item xs={12}>
            <SaveOrderButton
              onSave={handleSaveOrder}
              loading={loading}
              itemCount={items.length}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};