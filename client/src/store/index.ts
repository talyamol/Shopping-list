import { configureStore } from '@reduxjs/toolkit';
import shoppingListReducer from './shoppingListSlice';

export const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;