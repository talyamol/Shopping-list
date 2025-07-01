import mongoose, { Schema } from 'mongoose';

export interface IShoppingItem {
  name: string;
  category: string;
  quantity: number;
}

export const ShoppingItemSchema = new Schema<IShoppingItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [1, 'Item name must be at least 1 character'],
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [999, 'Quantity cannot exceed 999']
  }
}, { _id: false });
