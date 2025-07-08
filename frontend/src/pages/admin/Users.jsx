// frontend/src/pages/admin/Users.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";

import { useUserStore } from "../../store/userStore.js";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";
import UserRow from "../../components/ui/UserRow.jsx";

const Users = () => {
  const {
    users,
    loading,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    updateUser,
    deleteUser,
  } = useUserStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ role: "", isActive: true });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0 || e.target.value.length >= 3) {
      fetchUsers({ page: 1 });
    }
  };

  const handlePageChange = (page) => {
    fetchUsers({ page });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, isActive: user.isActive });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id, editForm);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser._id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <Card.Content>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar usuarios por nombre o email..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={() => fetchUsers({ page: 1 })}>Buscar</Button>
          </div>
        </Card.Content>
      </Card>

      {/* Users Table */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último acceso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron usuarios</p>
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuario"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="form-label">Rol</label>
            <select
              className="form-input"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              required
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="form-label">Estado</label>
            <select
              className="form-input"
              value={editForm.isActive}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  isActive: e.target.value === "true",
                })
              }
              required
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Usuario"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
            ?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer y eliminará al usuario tanto de
            Clerk como de la base de datos.
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

export default Users;
