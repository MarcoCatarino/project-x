// frontend/src/layouts/AdminLayout.jsx (CORREGIDO)
import { useEffect } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { ROUTES } from "../const/index.js";

const AdminLayout = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { user, isAdmin, fetchCurrentUser } = useAuthStore();
  const location = useLocation();

  // Fetch user data cuando Clerk esté listo y tengamos un usuario autenticado
  useEffect(() => {
    if (isLoaded && clerkUser && !user) {
      fetchCurrentUser().catch(console.error);
    }
  }, [isLoaded, clerkUser?.id, user?._id]);

  // Loading mientras Clerk inicializa
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 rounded-full animate-spin border-primary-500"></div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!clerkUser) {
    return <Navigate to="/sign-in" replace />;
  }

  // Loading mientras obtenemos data del usuario desde nuestro backend
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-b-2 rounded-full animate-spin border-primary-500"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar permisos de admin
  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Acceso Denegado
          </h2>
          <p className="mb-6 text-gray-600">
            No tienes permisos para acceder al panel de administración.
          </p>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: "📊" },
    { name: "Usuarios", href: ROUTES.ADMIN_USERS, icon: "👥" },
    { name: "Productos", href: ROUTES.ADMIN_PRODUCTS, icon: "📦" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <UserButton />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
