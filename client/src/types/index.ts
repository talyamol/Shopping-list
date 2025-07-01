// src/types/index.ts
export interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

export interface ShoppingItem {
  name: string;
  category: string;
  quantity: number;
}

export interface Order {
  _id: string;
  items: ShoppingItem[];
  totalItems: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Redux State Types
export interface ShoppingListState {
  items: ShoppingItem[];
  categories: Category[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalItems: number;
}

export interface RootState {
  shoppingList: ShoppingListState;
}

export interface AddItemFormProps {
  onAddItem: (item: Omit<ShoppingItem, 'quantity'> & { quantity?: number }) => void;
}

export interface ShoppingListDisplayProps {
  items: ShoppingItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
}

export interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
  onDeleteOrder: (orderId: string) => void;
}