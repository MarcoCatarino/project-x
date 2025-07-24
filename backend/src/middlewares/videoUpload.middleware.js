import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

//TODO: Configurar Cloudinary storage para videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project-x/hero-videos",
    allowed_formats: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
    resource_type: "video",
    transformation: [
      { width: 1920, height: 1080, crop: "limit", quality: "auto" }
    ],
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit para videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

//TODO: Error handling middleware para videos
export const handleVideoUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Video too large. Maximum size is 100MB" });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Only video files are allowed!") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

