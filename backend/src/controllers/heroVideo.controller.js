import { HeroVideo } from "../models/heroVideo.model.js";
import { cloudinary } from "../config/cloudinary.js";

//TODO: Obtener video activo del hero (público)
export const getActiveHeroVideo = async (req, res) => {
  try {
    const activeVideo = await HeroVideo.findOne({ isActive: true })
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!activeVideo) {
      return res.json(null); // No hay video activo
    }

    res.json(activeVideo);
  } catch (error) {
    console.error("Get active hero video error:", error);
    res.status(500).json({ error: "Failed to fetch active hero video" });
  }
};

//TODO: Obtener todos los videos del hero (admin)
export const getAllHeroVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const videos = await HeroVideo.find()
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HeroVideo.countDocuments();

    res.json({
      videos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get hero videos error:", error);
    res.status(500).json({ error: "Failed to fetch hero videos" });
  }
};

//TODO: Crear nuevo video del hero (admin)
export const createHeroVideo = async (req, res) => {
  try {
    const { title, description, overlayText } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    const heroVideo = new HeroVideo({
      title,
      description,
      videoUrl: req.file.path,
      videoPublicId: req.file.filename,
      overlayText: overlayText ? JSON.parse(overlayText) : undefined,
      createdBy: req.user._id,
    });

    await heroVideo.save();
    await heroVideo.populate("createdBy", "firstName lastName");

    res.status(201).json(heroVideo);
  } catch (error) {
    console.error("Create hero video error:", error);
    res.status(500).json({ error: "Failed to create hero video" });
  }
};

//TODO: Actualizar video del hero (admin)
export const updateHeroVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, overlayText, isActive } = req.body;

    const updateData = {
      title,
      description,
      isActive: isActive === "true",
      updatedBy: req.user._id,
    };

    if (overlayText) {
      updateData.overlayText = JSON.parse(overlayText);
    }

    // Si se sube un nuevo video
    if (req.file) {
      // Eliminar video anterior de Cloudinary
      const existingVideo = await HeroVideo.findById(id);
      if (existingVideo && existingVideo.videoPublicId) {
        await cloudinary.uploader.destroy(existingVideo.videoPublicId, {
          resource_type: "video",
        });
      }

      updateData.videoUrl = req.file.path;
      updateData.videoPublicId = req.file.filename;
    }

    const heroVideo = await HeroVideo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!heroVideo) {
      return res.status(404).json({ error: "Hero video not found" });
    }

    res.json(heroVideo);
  } catch (error) {
    console.error("Update hero video error:", error);
    res.status(500).json({ error: "Failed to update hero video" });
  }
};

//TODO: Activar/desactivar video del hero (admin)
export const toggleHeroVideoActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const heroVideo = await HeroVideo.findByIdAndUpdate(
      id,
      {
        isActive: isActive,
        updatedBy: req.user._id,
      },
      { new: true }
    ).populate("createdBy", "firstName lastName");

    if (!heroVideo) {
      return res.status(404).json({ error: "Hero video not found" });
    }

    res.json(heroVideo);
  } catch (error) {
    console.error("Toggle hero video error:", error);
    res.status(500).json({ error: "Failed to toggle hero video status" });
  }
};

//TODO: Eliminar video del hero (admin)
export const deleteHeroVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const heroVideo = await HeroVideo.findById(id);
    if (!heroVideo) {
      return res.status(404).json({ error: "Hero video not found" });
    }

    // Eliminar video de Cloudinary
    if (heroVideo.videoPublicId) {
      await cloudinary.uploader.destroy(heroVideo.videoPublicId, {
        resource_type: "video",
      });
    }

    await HeroVideo.findByIdAndDelete(id);

    res.json({ message: "Hero video deleted successfully" });
  } catch (error) {
    console.error("Delete hero video error:", error);
    res.status(500).json({ error: "Failed to delete hero video" });
  }
};
