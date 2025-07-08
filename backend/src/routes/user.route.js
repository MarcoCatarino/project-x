import express from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../controllers/user.controller.js";

import {
  verifyToken,
  requireAdmin,
  requireActiveUser,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// TODO: Protected routes
router.use(verifyToken);
router.use(requireActiveUser);

// TODO: Current user route
// * Get Current User
router.get("/me", getCurrentUser);

// TODO: Admin only routes
// * Get All Users
router.get("/", requireAdmin, getAllUsers);

// * Get User By ID
router.get("/:id", requireAdmin, getUserById);

// * Update User
router.put("/:id", requireAdmin, updateUser);

// * Delete User
router.delete("/:id", requireAdmin, deleteUser);

export default router;
