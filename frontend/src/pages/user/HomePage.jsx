import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useProductStore } from "../../store/productSotre.js";
import { useHeroVideoStore } from "../../store/heroVideoStore.js";

import Button from "../../components/ui/Button.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ProductCard from "../../components/ui/ProductCard.jsx";
import VideoHero from "../../components/ui/VideoHero.jsx";

const HomePage = () => {
  const {
    products,
    loading: productsLoading,
    fetchProducts,
  } = useProductStore();
  const {
    activeHeroVideo,
    loading: videoLoading,
    fetchActiveHeroVideo,
  } = useHeroVideoStore();

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Cargar video del hero y productos destacados
    fetchActiveHeroVideo();
    fetchProducts({ featured: true, limit: 6 });
  }, [fetchActiveHeroVideo, fetchProducts]);

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 6));
  }, [products]);

  return (
    <div>
      {/* Video Hero Section - Ocupa 100% de la altura de la pantalla */}
      <VideoHero heroVideo={activeHeroVideo} loading={videoLoading} />

      {/* Featured Products Section - Aparece después del scroll */}
      <FeaturedProductsSection
        products={featuredProducts}
        loading={productsLoading}
      />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

// Componente separado para Productos Destacados
const FeaturedProductsSection = ({ products, loading }) => (
  <section className="py-16 bg-gray-50">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Productos Destacados
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Los productos más populares de nuestra tienda
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            No hay productos destacados disponibles.
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link to="/products">
          <Button variant="outline" size="lg">
            Ver Todos los Productos
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

// Componente separado para Features
const FeaturesSection = () => {
  const features = [
    {
      icon: "🚚",
      title: "Envío Rápido",
      description: "Entrega en 24-48 horas en toda la ciudad",
    },
    {
      icon: "🛡️",
      title: "Garantía de Calidad",
      description: "Todos nuestros productos tienen garantía",
    },
    {
      icon: "💳",
      title: "Pago Seguro",
      description: "Múltiples opciones de pago seguras",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente separado para cada Feature
const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg bg-primary-100">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

export default HomePage;
