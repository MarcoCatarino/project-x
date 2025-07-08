// frontend/src/App.jsx (ACTUALIZADO CON LIMPIEZA DE URL)
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { useCleanUrl } from "./hooks/useCleanUrl.js";
import { useAuthStore } from "./store/useAuthStore.js";
import AppRoutes from "./routes/AppRoutes.route.jsx";
import LoadingSpinner from "./components/ui/LoadingSpinner.jsx";

function App() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { user, fetchCurrentUser, clearUser } = useAuthStore();

  // Hook para limpiar parámetros de Clerk de la URL
  useCleanUrl();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser && !user) {
      fetchCurrentUser().catch((error) => {
        console.error("Error fetching user:", error);
      });
    } else if (!isSignedIn && user) {
      clearUser();
    }
  }, [isLoaded, isSignedIn, clerkUser?.id, user?._id]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
