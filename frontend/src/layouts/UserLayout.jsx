// frontend/src/layouts/UserLayout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

import { ROUTES } from "../const/index.js";

const UserLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: ROUTES.HOME },
    { name: "Productos", href: ROUTES.PRODUCTS },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to={ROUTES.HOME}
                className="text-2xl font-bold text-primary-600"
              >
                Project-X
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Iniciar Sesión
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 Project-X. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
