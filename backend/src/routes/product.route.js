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
} from "../middlewares/auth.middleware.js";

import { upload, handleUploadError } from "../middlewares/upload.middleware.js";

const router = express.Router();

// TODO: Public routes
// * Get All Products
router.get("/", getAllProducts);

// * Get All Categories
router.get("/categories", getCategories);

// * Get Product By ID
router.get("/:id", getProductById);

// TODO: Protected routes
router.use(verifyToken);
router.use(requireActiveUser);

// TODO: Admin only routes
// * Create Product
router.post(
  "/",
  requireAdmin,
  upload.array("images", 5),
  handleUploadError,
  createProduct
);

// * Update Product
router.put(
  "/:id",
  requireAdmin,
  upload.array("images", 5),
  handleUploadError,
  updateProduct
);

// * Delete Product
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
