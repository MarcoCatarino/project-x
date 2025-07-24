import mongoose from "mongoose";

const heroVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoPublicId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    overlayText: {
      title: {
        type: String,
        default: "Bienvenido a Project-X",
      },
      subtitle: {
        type: String,
        default: "Descubre los mejores productos",
      },
      buttonText: {
        type: String,
        default: "Ver Productos",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//? Solo un video puede estar activo a la vez
heroVideoSchema.pre('save', async function(next) {
  if (this.isActive) {
    // Desactivar todos los otros videos
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export const HeroVideo = mongoose.model("HeroVideo", heroVideoSchema);