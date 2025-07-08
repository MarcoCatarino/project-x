export const ENV = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
};
