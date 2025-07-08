// backend/src/routes/productRoutes.js (ACTUALIZADO)
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/products.controller.js";

import {
  verifyToken,
  requireAdmin,
  requireActiveUser,
  optionalAuth,
} from "../middlewares/auth.middleware.js";
import { upload, handleUploadError } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes (productos pueden verse sin autenticación)
router.get("/", optionalAuth, getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", optionalAuth, getProductById);

// Protected routes
router.use(verifyToken);
router.use(requireActiveUser);

// Admin only routes
router.post(
  "/",
  requireAdmin,
  upload.array("images", 5),
  handleUploadError,
  createProduct
);

router.put(
  "/:id",
  requireAdmin,
  upload.array("images", 5),
  handleUploadError,
  updateProduct
);

router.delete("/:id", requireAdmin, deleteProduct);

export default router;
