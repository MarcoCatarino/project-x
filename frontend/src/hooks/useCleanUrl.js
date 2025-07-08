// frontend/src/hooks/useCleanUrl.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useCleanUrl = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Lista de parámetros de Clerk que queremos limpiar
    const clerkParams = [
      "__clerk_db_jwt",
      "__clerk_status",
      "__clerk_error",
      "__clerk_redirect",
      "__clerk_handshake",
    ];

    let shouldClean = false;

    // Verificar si existe algún parámetro de Clerk
    clerkParams.forEach((param) => {
      if (urlParams.has(param)) {
        urlParams.delete(param);
        shouldClean = true;
      }
    });

    // Si encontramos parámetros de Clerk, limpiar la URL
    if (shouldClean) {
      const newUrl = urlParams.toString()
        ? `${location.pathname}?${urlParams.toString()}`
        : location.pathname;

      // Reemplazar la URL sin agregar entrada al historial
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);
};
