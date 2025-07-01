import { Request, Response } from 'express';
import { Category } from '../models/Category';

export class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      
      // Check if category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({ error: 'Category already exists' });
      }

      const category = new Category({ name });
      await category.save();
      
      res.status(201).json(category);
    } catch (error:any) {
      console.error('Error creating category:', error);
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Category already exists' });
      }
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
}