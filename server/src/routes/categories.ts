import express from 'express';
import {body} from 'express-validator';
import {CategoryController} from '../controllers/CategoryController';
import {validateRequest} from '../middleware/validateRequest';

const router = express.Router();
const categoryController = new CategoryController();

router.get('/', categoryController.getAllCategories);

router.post(
  '/',
  [body('name').isString().trim().isLength({min: 2, max: 50}).withMessage('Category name must be between 2 and 50 characters')],
  validateRequest,
  categoryController.createCategory
);

export {router as categoriesRouter};
