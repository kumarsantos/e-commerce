import express from 'express';
import {
  newOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  singleOrder,
  myOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/orders')
  .get(isAuthenticatedUser, authorizeRoles(['admin']), getAllOrders);

router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/order/new').post(isAuthenticatedUser, newOrder);

router
  .route('/order/status/:id')
  .put(isAuthenticatedUser, authorizeRoles(['admin']), updateOrderStatus);

router
  .route('/order/:id')
  .get(isAuthenticatedUser, singleOrder)
  .put(isAuthenticatedUser, authorizeRoles(['admin']), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles(['admin']), deleteOrder);

export default router;
