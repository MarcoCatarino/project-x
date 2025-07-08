import clerkClient from "../config/clerk.js";

import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    //* Verify token with Clerk
    const sessionClaims = await clerkClient.sessions.verifyToken(token);

    if (!sessionClaims) {
      return res.status(401).json({ error: "Invalid token" });
    }

    //* Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);

    //* Find or create user in our database
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) {
      //* Create new user if doesn't exist
      user = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        avatar: clerkUser.imageUrl,
        lastLogin: new Date(),
      });
      await user.save();
    } else {
      //* Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const requireActiveUser = (req, res, next) => {
  if (!req.user || !req.user.isActive) {
    return res.status(403).json({ error: "Account is not active" });
  }
  next();
};
