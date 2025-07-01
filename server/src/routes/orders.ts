import express from 'express';
import {body} from 'express-validator';
import {OrderController} from '../controllers/OrderController';
import {validateRequest} from '../middleware/validateRequest';

const router = express.Router();
const orderController = new OrderController();

router.get('/', orderController.getAllOrders);

router.get('/:id', orderController.getOrderById);

router.post(
  '/',
  [
    body('items').isArray({min: 1}).withMessage('Items must be a non-empty array'),
    body('items.*.name').isString().trim().isLength({min: 1, max: 100}).withMessage('Item name must be between 1 and 100 characters'),
    body('items.*.category').isString().trim().notEmpty().withMessage('Category is required'),
    body('items.*.quantity').isInt({min: 1, max: 999}).withMessage('Quantity must be between 1 and 999'),
  ],
  validateRequest,
  orderController.createOrder
);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', orderController.deleteOrder);

export {router as ordersRouter};
