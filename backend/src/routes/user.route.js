// backend/src/routes/userRoutes.js (ACTUALIZADO)
import express from 'express';

import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getCurrentUser 
} from '../controllers/user.controller.js';

import { verifyToken, requireAdmin, requireActiveUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (none for users)

// Protected routes
router.use(verifyToken);
router.use(requireActiveUser);

// Current user route
router.get('/me', getCurrentUser);

// Admin only routes
router.get('/', requireAdmin, getAllUsers);
router.get('/:id', requireAdmin, getUserById);
router.put('/:id', requireAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;