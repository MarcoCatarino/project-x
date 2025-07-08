// frontend/src/pages/user/ProductPage.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useProductStore } from "../../store/productSotre.js";

import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ImageGallery from "../../components/ui/ImageGallery.jsx";
import QuantitySelector from "../../components/ui/QuantitySelector.jsx";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProduct,
    loading,
    error,
    fetchProductById,
    clearCurrentProduct,
  } = useProductStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProductById(id).catch(() => {
        navigate("/products");
      });
    }

    return () => {
      clearCurrentProduct();
    };
  }, [id, fetchProductById, clearCurrentProduct, navigate]);

  const handleAddToCart = () => {
    alert(`Agregado al carrito: ${quantity} x ${currentProduct.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/products">
            <Button>Volver a Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">
            Productos
          </Link>
          <span>/</span>
          <span className="text-gray-900">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <ImageGallery
            images={currentProduct.images}
            productName={currentProduct.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-lg text-gray-600">{currentProduct.category}</p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary-600">
              ${currentProduct.price.toLocaleString("es-MX")}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Stock:</span>
              {currentProduct.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {currentProduct.stock} disponibles
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Agotado
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Tags */}
            {currentProduct.tags && currentProduct.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {currentProduct.stock > 0 && (
              <Card>
                <Card.Content>
                  <div className="space-y-4">
                    <QuantitySelector
                      max={currentProduct.stock}
                      onQuantityChange={setQuantity}
                    />

                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="w-full"
                    >
                      Agregar al Carrito
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Product Details */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Detalles del Producto</h3>
              </Card.Header>
              <Card.Content className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{currentProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock disponible:</span>
                  <span className="font-medium">{currentProduct.stock}</span>
                </div>
                {currentProduct.featured && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Producto destacado:</span>
                    <span className="font-medium text-primary-600">✓</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de registro:</span>
                  <span className="font-medium">
                    {new Date(currentProduct.createdAt).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              ← Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
