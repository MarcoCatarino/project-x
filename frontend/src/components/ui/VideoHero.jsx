/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const VideoHero = ({ heroVideo, loading }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && heroVideo) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        setHasError(false);
      };

      const handleError = () => {
        setHasError(true);
        setIsVideoLoaded(false);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      };
    }
  }, [heroVideo]);

  if (!heroVideo || hasError) {
    return (
      <section className="relative flex items-center justify-center h-screen text-white bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="z-10 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Bienvenido a Project-X
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-primary-100">
            Descubre los mejores productos con la mejor calidad
          </p>
          <Link to="/products">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Ver Productos
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {!isVideoLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
            <LoadingSpinner size="xl" className="text-white" />
          </div>
        )}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={heroVideo.videoUrl} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl lg:text-7xl drop-shadow-lg">
            {heroVideo.overlayText?.title || "Bienvenido a Project-X"}
          </h1>
          <p className="mb-8 text-xl text-gray-100 md:text-2xl lg:text-3xl drop-shadow-md">
            {heroVideo.overlayText?.subtitle ||
              "Descubre los mejores productos"}
          </p>
          <Link to="/products">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform bg-white shadow-lg text-primary-600 hover:bg-gray-100 hover:shadow-xl hover:scale-105"
            >
              {heroVideo.overlayText?.buttonText || "Ver Productos"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute z-10 transform -translate-x-1/2 bottom-8 left-1/2">
        <div className="animate-bounce">
          <div className="flex justify-center w-6 h-10 border-2 border-white rounded-full">
            <div className="w-1 h-3 mt-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="mt-2 text-sm text-center text-white">Scroll</p>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
