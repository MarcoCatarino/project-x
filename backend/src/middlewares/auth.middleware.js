// backend/src/middlewares/authMiddleware.js (MÉTODO CORRECTO)
import clerkClient from "../config/clerk.js";
import { verifyToken as clerkVerifyToken } from "@clerk/backend";

import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // MÉTODO CORRECTO: Usar verifyToken de @clerk/backend
    const payload = await clerkVerifyToken(token, {
      secretKey: ENV.CLERK_SECRET_KEY,
    });

    if (!payload || !payload.sub) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Obtener usuario de Clerk usando el payload
    const clerkUser = await clerkClient.users.getUser(payload.sub);

    if (!clerkUser) {
      return res.status(401).json({ error: "User not found in Clerk" });
    }

    // Buscar o crear usuario en nuestra base de datos
    let user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) {
      // Crear nuevo usuario si no existe
      user = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        avatar: clerkUser.imageUrl,
        lastLogin: new Date(),
      });
      await user.save();
      console.log(`✅ Created new user: ${user.email}`);
    } else {
      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();
    }

    // Agregar usuario al request
    req.user = user;
    req.clerkUser = clerkUser;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    // Manejar diferentes tipos de errores de Clerk
    if (error.message.includes("JWT")) {
      return res.status(401).json({ error: "Invalid JWT token" });
    }

    if (error.message.includes("expired")) {
      return res.status(401).json({ error: "Token expired" });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    return res.status(500).json({ error: "Internal authentication error" });
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

// Middleware opcional para rutas públicas
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continuar sin autenticación
    }

    // Si hay token, intentar verificarlo
    await verifyToken(req, res, next);
  } catch (error) {
    // Si falla la autenticación opcional, continuar sin usuario
    next();
  }
};
