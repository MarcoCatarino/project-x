// frontend/src/pages/user/ProductsPage.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productSotre.js";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import ProductCard from "../../components/ui/ProductCard.jsx";
import FilterBar from "../../components/ui/FilterBar.jsx";

const ProductsPage = () => {
  const {
    products,
    categories,
    loading,
    pagination,
    filters,
    setFilters,
    fetchProducts,
    fetchCategories,
  } = useProductStore();

  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    fetchProducts({ page: 1 });
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      featured: "",
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    fetchProducts({ page: 1 });
  };

  const handlePageChange = (page) => {
    fetchProducts({ page });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros Productos
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <Card.Content>
            <FilterBar
              filters={localFilters}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              categories={categories}
              placeholder="Buscar productos..."
            />
          </Card.Content>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="xl" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button onClick={clearFilters}>Limpiar Filtros</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
