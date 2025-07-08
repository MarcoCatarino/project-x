// frontend/src/const/index.js
export const ROUTES = {
  // User routes
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",

  // Admin routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
};

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Automotive",
  "Others",
];

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  ADMIN_LIMIT: 10,
};
