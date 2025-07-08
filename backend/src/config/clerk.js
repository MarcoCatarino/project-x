// backend/src/config/clerk.js (ACTUALIZADO)
import { createClerkClient } from "@clerk/backend";
import { ENV } from "./env.js";

const clerkClient = createClerkClient({
  secretKey: ENV.CLERK_SECRET_KEY,
  publishableKey: ENV.CLERK_PUBLISHABLE_KEY,
});

export default clerkClient;
