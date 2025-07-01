import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
