// backend/src/models/User.js (SIN ÍNDICES DUPLICADOS)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      // REMOVER: unique: true (para evitar duplicado con schema.index)
    },
    email: {
      type: String,
      required: true,
      // REMOVER: unique: true (para evitar duplicado con schema.index)
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Solo declarar índices aquí (una sola vez)
userSchema.index({ clerkId: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
