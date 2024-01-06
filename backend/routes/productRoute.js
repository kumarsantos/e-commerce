import express from 'express';
import {
  getAllProduct,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} from '../controllers/productController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.route('/products').get(getAllProduct);
router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizeRoles(['admin']), createProduct);
router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles(['admin']), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles(['admin']), deleteProduct);

router
  .route('/product/reviews')
  .put(isAuthenticatedUser, createProductReview)
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);

router.route('/product/:id').get(getSingleProduct);
export default router;
