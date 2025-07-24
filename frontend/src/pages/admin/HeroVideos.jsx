// frontend/src/pages/admin/HeroVideos.jsx
import { useEffect, useState } from "react";
import { useHeroVideoStore } from "../../store/heroVideoStore.js";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Modal from "../../components/ui/Modal.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";

const HeroVideos = () => {
  const {
    heroVideos,
    loading,
    pagination,
    fetchHeroVideos,
    createHeroVideo,
    updateHeroVideo,
    toggleHeroVideoActive,
    deleteHeroVideo,
  } = useHeroVideoStore();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
    overlayText: {
      title: "Bienvenido a Project-X",
      subtitle: "Descubre los mejores productos",
      buttonText: "Ver Productos",
    },
  });

  useEffect(() => {
    fetchHeroVideos();
  }, [fetchHeroVideos]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      video: null,
      overlayText: {
        title: "Bienvenido a Project-X",
        subtitle: "Descubre los mejores productos",
        buttonText: "Ver Productos",
      },
    });
  };

  const handlePageChange = (page) => {
    fetchHeroVideos({ page });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      video: null,
      overlayText: video.overlayText || {
        title: "Bienvenido a Project-X",
        subtitle: "Descubre los mejores productos",
        buttonText: "Ver Productos",
      },
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("overlayText", JSON.stringify(formData.overlayText));

    if (formData.video) {
      submitData.append("video", formData.video);
    }

    try {
      if (isEdit) {
        await updateHeroVideo(selectedVideo._id, submitData);
        setIsEditModalOpen(false);
      } else {
        await createHeroVideo(submitData);
        setIsCreateModalOpen(false);
      }
      resetForm();
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error saving hero video:", error);
      alert("Error al guardar el video. Verifica que el archivo sea válido.");
    }
  };

  const handleToggleActive = async (video) => {
    try {
      await toggleHeroVideoActive(video._id, !video.isActive);
    } catch (error) {
      console.error("Error toggling video status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHeroVideo(selectedVideo._id);
      setIsDeleteModalOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error deleting hero video:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Videos del Hero Principal
          </h1>
          <p className="text-gray-600">
            Gestiona los videos que aparecen en la página de inicio
          </p>
        </div>
        <Button onClick={openCreateModal}>Subir Nuevo Video</Button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="flex justify-center py-12 col-span-full">
            <LoadingSpinner size="xl" />
          </div>
        ) : heroVideos.length > 0 ? (
          heroVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onToggleActive={handleToggleActive}
            />
          ))
        ) : (
          <div className="py-12 text-center col-span-full">
            <div className="text-gray-500">
              <p className="mb-4 text-lg">No hay videos del hero</p>
              <Button onClick={openCreateModal}>Subir tu primer video</Button>
            </div>
          </div>
        )}
      </div>

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
        title="Subir Nuevo Video del Hero"
        size="lg"
      >
        <VideoForm
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
        title="Editar Video del Hero"
        size="lg"
      >
        <VideoForm
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
        title="Eliminar Video del Hero"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar el video{" "}
            <strong>{selectedVideo?.title}</strong>?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer y eliminará el video de Cloudinary.
          </p>

          <div className="flex justify-end pt-4 space-x-2">
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

// Componente para mostrar cada video
const VideoCard = ({ video, onEdit, onDelete, onToggleActive }) => {
  return (
    <Card className="overflow-hidden">
      {/* Video Preview */}
      <div className="bg-gray-900 aspect-video">
        <video
          src={video.videoUrl}
          className="object-cover w-full h-full"
          muted
          preload="metadata"
        />
      </div>

      <Card.Content>
        <div className="space-y-3">
          {/* Title and Active Status */}
          <div className="flex items-start justify-between">
            <h3 className="flex-1 text-lg font-semibold text-gray-900">
              {video.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                video.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {video.isActive ? "✅ Activo" : "⏸️ Inactivo"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>

          {/* Overlay Text Preview */}
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="mb-1 text-xs text-gray-500">Texto superpuesto:</p>
            <p className="text-sm font-medium">{video.overlayText?.title}</p>
            <p className="text-xs text-gray-600">
              {video.overlayText?.subtitle}
            </p>
          </div>

          {/* Creation Info */}
          <div className="text-xs text-gray-500">
            Creado por {video.createdBy?.firstName} {video.createdBy?.lastName}
            <br />
            {new Date(video.createdAt).toLocaleDateString("es-MX")}
          </div>

          {/* Actions */}
          <div className="flex pt-2 space-x-2">
            <Button
              size="sm"
              variant={video.isActive ? "secondary" : "primary"}
              onClick={() => onToggleActive(video)}
              className="flex-1"
            >
              {video.isActive ? "Desactivar" : "Activar"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(video)}>
              Editar
            </Button>
            <Button size="sm" variant="danger" onClick={() => onDelete(video)}>
              Eliminar
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

// Componente del formulario
const VideoForm = ({ formData, setFormData, onSubmit, onCancel, isEdit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input
      label="Título del video"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

    <div>
      <label className="form-label">
        Archivo de video {isEdit && "(opcional para actualizar)"}
      </label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
        className="form-input"
        {...(!isEdit && { required: true })}
      />
      <p className="mt-1 text-xs text-gray-500">
        Formatos soportados: MP4, MOV, AVI, WebM. Máximo 100MB.
      </p>
    </div>

    {/* Overlay Text Configuration */}
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Texto superpuesto</h4>

      <Input
        label="Título principal"
        value={formData.overlayText.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            overlayText: { ...formData.overlayText, title: e.target.value },
          })
        }
        placeholder="Bienvenido a Project-X"
      />

      <Input
        label="Subtítulo"
        value={formData.overlayText.subtitle}
        onChange={(e) =>
          setFormData({
            ...formData,
            overlayText: { ...formData.overlayText, subtitle: e.target.value },
          })
        }
        placeholder="Descubre los mejores productos"
      />

      <Input
        label="Texto del botón"
        value={formData.overlayText.buttonText}
        onChange={(e) =>
          setFormData({
            ...formData,
            overlayText: {
              ...formData.overlayText,
              buttonText: e.target.value,
            },
          })
        }
        placeholder="Ver Productos"
      />
    </div>

    <div className="flex justify-end pt-4 space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">{isEdit ? "Actualizar" : "Subir"} Video</Button>
    </div>
  </form>
);

export default HeroVideos;
