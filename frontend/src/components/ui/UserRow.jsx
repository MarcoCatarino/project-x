// frontend/src/components/ui/UserRow.jsx
import Button from "./Button.jsx";

const UserRow = ({ user, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(user.lastLogin).toLocaleDateString("es-MX")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(user)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default UserRow;
