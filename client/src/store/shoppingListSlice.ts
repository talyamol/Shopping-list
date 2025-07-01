import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {ShoppingItem, Category, Order, ShoppingListState} from '@/types';
import {api} from '../services/api';

// Async thunks
export const fetchCategories = createAsyncThunk('shoppingList/fetchCategories', async (_, {rejectWithValue}) => {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
  }
});

export const saveOrder = createAsyncThunk('shoppingList/saveOrder', async (items: ShoppingItem[], {rejectWithValue}) => {
  try {
    const response = await api.post<Order>('/orders', {items});
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to save order');
  }
});

export const fetchOrders = createAsyncThunk('shoppingList/fetchOrders', async (params: {page?: number; limit?: number} = {}, {rejectWithValue}) => {
  try {
    const response = await api.get('/orders', {params});
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
  }
});

export const deleteOrder = createAsyncThunk('shoppingList/deleteOrder', async (orderId: string, {rejectWithValue}) => {
  try {
    await api.delete(`/orders/${orderId}`);
    return orderId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete order');
  }
});

const initialState: ShoppingListState = {
  items: [],
  categories: [],
  orders: [],
  loading: false,
  error: null,
  totalItems: 0,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.name.toLowerCase() === action.payload.name.toLowerCase() && item.category === action.payload.category
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },

    updateItemQuantity: (state, action: PayloadAction<{index: number; quantity: number}>) => {
      const {index, quantity} = action.payload;
      if (state.items[index] && quantity > 0) {
        state.items[index].quantity = quantity;
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },

    clearItems: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    clearError: (state) => {
      state.error = null;
    },

    loadOrder: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = [...action.payload];
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },

    clearOrderHistory: (state) => {
      state.orders = [];
    },
  },

  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save Order
    builder
      .addCase(saveOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.items = [];
        state.totalItems = 0;
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {addItem, updateItemQuantity, removeItem, clearItems, clearError, loadOrder, clearOrderHistory} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
