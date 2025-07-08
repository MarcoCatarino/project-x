import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export default clerkClient;
