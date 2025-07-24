import express from "express";

import {
  getActiveHeroVideo,
  getAllHeroVideos,
  createHeroVideo,
  updateHeroVideo,
  toggleHeroVideoActive,
  deleteHeroVideo,
} from "../controllers/heroVideo.controller.js";

import {
  verifyToken,
  requireAdmin,
  requireActiveUser,
} from "../middlewares/auth.middleware.js";

import {
  handleVideoUploadError,
  uploadVideo,
} from "../middlewares/videoUpload.middleware.js";

const router = express.Router();

//TODO: Ruta pública para obtener video activo
router.get("/active", getActiveHeroVideo);

//TODO: Rutas protegidas para administradores
router.use(verifyToken);
router.use(requireActiveUser);
router.use(requireAdmin);

//TODO: CRUD para videos del hero
router.get("/", getAllHeroVideos);
router.post(
  "/",
  uploadVideo.single("video"),
  handleVideoUploadError,
  createHeroVideo
);
router.put(
  "/:id",
  uploadVideo.single("video"),
  handleVideoUploadError,
  updateHeroVideo
);
router.patch("/:id/toggle", toggleHeroVideoActive);
router.delete("/:id", deleteHeroVideo);

export default router;
