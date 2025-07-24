// frontend/src/routes/AppRoutes.jsx (CON LIMPIEZA DE URL)
import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import UserLayout from "../layouts/UserLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { ROUTES } from "../const/index.js";

// User Pages
import HomePage from "../pages/user/HomePage.jsx";
import ProductsPage from "../pages/user/ProductsPage.jsx";
import ProductPage from "../pages/user/ProductPage.jsx";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard.jsx";
import Users from "../pages/admin/Users.jsx";
import Products from "../pages/admin/Products.jsx";
import HeroVideos from "../pages/admin/HeroVideos.jsx";

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Limpiar parámetros de Clerk de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    if (
      urlParams.has("__clerk_db_jwt") ||
      urlParams.has("__clerk_status") ||
      urlParams.has("__clerk_error")
    ) {
      // Eliminar todos los parámetros de Clerk
      urlParams.delete("__clerk_db_jwt");
      urlParams.delete("__clerk_status");
      urlParams.delete("__clerk_error");
      urlParams.delete("__clerk_redirect");
      urlParams.delete("__clerk_handshake");

      // Construir nueva URL limpia
      const newUrl = urlParams.toString()
        ? `${location.pathname}?${urlParams.toString()}`
        : location.pathname;

      // Reemplazar sin agregar al historial
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/sign-in/*"
        element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignIn
              routing="path"
              path="/sign-in"
              afterSignInUrl="/"
              redirectUrl="/"
            />
          </div>
        }
      />
      <Route
        path="/sign-up/*"
        element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignUp
              routing="path"
              path="/sign-up"
              afterSignUpUrl="/"
              redirectUrl="/"
            />
          </div>
        }
      />

      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="hero-videos" element={<HeroVideos />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
