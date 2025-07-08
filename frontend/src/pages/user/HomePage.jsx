/* eslint-disable no-unused-vars */
// frontend/src/pages/user/HomePage.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useProductStore } from "../../store/productSotre.js";

import Button from "../../components/ui/Button.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ProductCard from "../../components/ui/ProductCard.jsx";

const HomePage = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 6 });
  }, [fetchProducts]);

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 6));
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProductsSection products={featuredProducts} loading={loading} />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

// Componente separado para Hero Section
const HeroSection = () => (
  <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Bienvenido a Project-X
        </h1>
        <p className="mt-6 text-lg leading-8 text-primary-100">
          Descubre los mejores productos con la mejor calidad y precios
          increíbles.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Componente separado para Productos Destacados
const FeaturedProductsSection = ({ products, loading }) => (
  <section className="py-16 bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Productos Destacados
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Los productos más populares de nuestra tienda
        </p>
      </div>

      {products.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

export default HomePage;
