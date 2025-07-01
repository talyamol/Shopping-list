import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Category } from '../models/Category';

export class OrderController {
  async getAllOrders(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Order.countDocuments();
      
      res.json({
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { items } = req.body;

      // Validate that all categories exist
      const categoryNames = [...new Set(items.map(item => item.category))];
      const existingCategories = await Category.find({ name: { $in: categoryNames } });
      const existingCategoryNames = existingCategories.map(cat => cat.name);
      
      const invalidCategories = categoryNames.filter(name => !existingCategoryNames.includes(name));
      if (invalidCategories.length > 0) {
        return res.status(400).json({ 
          error: `Invalid categories: ${invalidCategories.join(', ')}` 
        });
      }

      // Group items by name and category, sum quantities
      const groupedItems = new Map();
      items.forEach(item => {
        const key = `${item.name}-${item.category}`;
        if (groupedItems.has(key)) {
          const existing = groupedItems.get(key);
          existing.quantity += item.quantity;
        } else {
          groupedItems.set(key, { ...item });
        }
      });

      const processedItems = Array.from(groupedItems.values());
      const totalItems = processedItems.reduce((sum, item) => sum + item.quantity, 0);
      const order = new Order({ items: processedItems, totalItems });
      await order.save();
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await Order.findByIdAndDelete(id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
}