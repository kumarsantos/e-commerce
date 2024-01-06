import express from 'express';
import {
  getAllUsers,
  registerUser,
  getSingleUser,
  updateUserByAdmin,
  deleteUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
} from '../controllers/userController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/users')
  .get(isAuthenticatedUser, authorizeRoles(['admin']), getAllUsers);
router.route('/user/register').post(registerUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/me').get(isAuthenticatedUser, getUserDetails);
router.route('/user/login').post(loginUser);
router.route('/user/updateProfile').put(isAuthenticatedUser, updateUserProfile);
router
  .route('/user/password/update')
  .put(isAuthenticatedUser, updateUserPassword);
router.route('/user/forgetPassword').post(forgotPassword);
router.route('/user/password/reset/:token').put(resetPassword);
router
  .route('/user/:id')
  .get(isAuthenticatedUser, authorizeRoles(['admin']), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles(['admin']), updateUserByAdmin)
  .delete(isAuthenticatedUser, authorizeRoles(['admin']), deleteUser);

export default router;
