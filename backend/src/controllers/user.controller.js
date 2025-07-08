// backend/src/controllers/userController.js (ACTUALIZADO)
import { User } from "../models/user.model.js";
import clerkClient from "../config/clerk.js";

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select("-clerkId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-clerkId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select("-clerkId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar que no sea el último admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ error: "Cannot delete the last admin user" });
      }
    }

    try {
      // Intentar eliminar de Clerk
      await clerkClient.users.deleteUser(user.clerkId);
    } catch (clerkError) {
      console.warn("Error deleting from Clerk:", clerkError.message);
      // Continuar con la eliminación local aunque falle Clerk
    }

    // Eliminar de nuestra base de datos
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // El usuario ya está en req.user desde el middleware
    const user = await User.findById(req.user._id).select("-clerkId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};
