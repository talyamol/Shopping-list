import mongoose, {Document, Schema} from 'mongoose';
import {IShoppingItem, ShoppingItemSchema} from './ShoppingItem';

export interface IOrder extends Document {
  items: IShoppingItem[];
  totalItems: number;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    items: {
      type: [ShoppingItemSchema],
      required: [true, 'Items are required'],
      validate: {
        validator: function (items: IShoppingItem[]) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    totalItems: {
      type: Number,
      required: [true, 'Total items count is required'],
      min: [1, 'Total items must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  next();
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
