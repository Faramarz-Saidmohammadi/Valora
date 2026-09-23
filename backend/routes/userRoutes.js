import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  authLimiter,
  registrationLimiter,
} from '../middleware/rateLimitMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

router.route('/').post(registrationLimiter, registerUser).get(protect, admin, getUsers);
router.post('/auth', authLimiter, authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, checkObjectId, deleteUser)
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser);

export default router;
