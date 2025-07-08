// frontend/src/pages/admin/Products.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";

import { useProductStore } from "../../store/productSotre.js";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import ProductRow from "../../components/ui/ProductRow.jsx";
import FilterBar from "../../components/ui/FilterBar.jsx";

import { PRODUCT_CATEGORIES } from "../../const/index.js";

const Products = () => {
  const {
    products,
    loading,
    pagination,
    filters,
    setFilters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
  } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    tags: "",
    featured: false,
    images: null,
  });
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      tags: "",
      featured: false,
      images: null,
    });
  };

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

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      tags: product.tags.join(", "),
      featured: product.featured,
      images: null,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("stock", formData.stock);
    submitData.append("tags", formData.tags);
    submitData.append("featured", formData.featured);

    if (formData.images) {
      Array.from(formData.images).forEach((file) => {
        submitData.append("images", file);
      });
    }

    try {
      if (isEdit) {
        await updateProduct(selectedProduct._id, submitData);
        setIsEditModalOpen(false);
      } else {
        await createProduct(submitData);
        setIsCreateModalOpen(false);
      }
      resetForm();
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct._id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Productos
          </h1>
          <p className="text-gray-600">Administra el catálogo de productos</p>
        </div>
        <Button onClick={openCreateModal}>Crear Producto</Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content>
          <FilterBar
            filters={localFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            categories={PRODUCT_CATEGORIES}
            placeholder="Buscar productos..."
          />
        </Card.Content>
      </Card>

      {/* Products Table */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <ProductRow
                      key={product._id}
                      product={product}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.current}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Producto"
        size="lg"
      >
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={(e) => handleSubmit(e, false)}
          onCancel={() => setIsCreateModalOpen(false)}
          isEdit={false}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Producto"
        size="lg"
      >
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={(e) => handleSubmit(e, true)}
          onCancel={() => setIsEditModalOpen(false)}
          isEdit={true}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Producto"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <strong>{selectedProduct?.name}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer y eliminará todas las imágenes
            asociadas.
          </p>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Componente separado para el formulario de producto
const ProductForm = ({ formData, setFormData, onSubmit, onCancel, isEdit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input
      label="Nombre del producto"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      required
    />

    <div>
      <label className="form-label">Descripción</label>
      <textarea
        className="form-input"
        rows={3}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Precio"
        type="number"
        step="0.01"
        min="0"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
      />

      <Input
        label="Stock"
        type="number"
        min="0"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        required
      />
    </div>

    <div>
      <label className="form-label">Categoría</label>
      <select
        className="form-input"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Seleccionar categoría</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    <Input
      label="Etiquetas (separadas por comas)"
      value={formData.tags}
      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
      placeholder="etiqueta1, etiqueta2, etiqueta3"
    />

    <div>
      <label className="form-label">Imágenes</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, images: e.target.files })}
        className="form-input"
        {...(!isEdit && { required: true })}
      />
      <p className="text-xs text-gray-500 mt-1">
        Máximo 5 imágenes, 5MB cada una
      </p>
    </div>

    <div className="flex items-center">
      <input
        type="checkbox"
        id="featured"
        checked={formData.featured}
        onChange={(e) =>
          setFormData({ ...formData, featured: e.target.checked })
        }
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
        Producto destacado
      </label>
    </div>

    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">{isEdit ? "Actualizar" : "Crear"} Producto</Button>
    </div>
  </form>
);

export default Products;
