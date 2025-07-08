// frontend/src/components/ui/ProductCard.jsx
import { Link } from "react-router-dom";
import Card from "./Card.jsx";
import Button from "./Button.jsx";

const ProductCard = ({ product, showActions = false, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.images[0]?.url || "/placeholder-image.jpg"}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </div>
      <Card.Content>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.category}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toLocaleString("es-MX")}
          </span>
          {!showActions && (
            <Link to={`/products/${product._id}`}>
              <Button size="sm">Ver Detalles</Button>
            </Link>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mb-4">
          {product.stock === 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Agotado
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {product.stock} disponibles
            </span>
          )}
        </div>

        {/* Admin actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
              className="flex-1"
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(product)}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        )}

        {/* Product badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⭐ Destacado
            </span>
          )}
          {!product.isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Inactivo
            </span>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
