import clerkClient from "../config/clerk.js";

import { User } from "../models/user.model.js";

// TODO: Get All Users
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
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// TODO: Get User By ID
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

// TODO: Update User
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

// TODO: Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //* Delete from Clerk
    await clerkClient.users.deleteUser(user.clerkId);

    //* Delete from our database
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// TODO: Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-clerkId");
    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
};
