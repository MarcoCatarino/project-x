// frontend/src/components/ui/ProductRow.jsx
import Button from "./Button.jsx";

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={product.images[0]?.url || "/placeholder-image.jpg"}
            alt={product.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-sm text-gray-500">
              {product.description.substring(0, 50)}...
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${product.price.toLocaleString("es-MX")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock} unidades
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {product.isActive ? "Activo" : "Inactivo"}
          </span>
          {product.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Destacado
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(product)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default ProductRow;
