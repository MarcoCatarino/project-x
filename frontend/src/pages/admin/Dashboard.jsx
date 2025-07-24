import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useProductStore } from "../../store/productSotre.js";
import { useUserStore } from "../../store/userStore.js";
import { useHeroVideoStore } from "../../store/heroVideoStore.js";

import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatsCard from "../../components/ui/StatsCard.jsx";
import RecentItem from "../../components/ui/RecentItem.jsx";

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();
  const { users, fetchUsers } = useUserStore();
  const { activeHeroVideo, fetchActiveHeroVideo } = useHeroVideoStore();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalValue: 0,
    hasActiveVideo: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts({ limit: 1000 }),
          fetchUsers({ limit: 1000 }),
          fetchActiveHeroVideo(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProducts, fetchUsers, fetchActiveHeroVideo]);

  useEffect(() => {
    if (products.length > 0) {
      const activeProducts = products.filter((p) => p.isActive).length;
      const outOfStock = products.filter((p) => p.stock === 0).length;
      const totalValue = products.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
      );

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        activeProducts,
        outOfStock,
        totalValue,
        hasActiveVideo: !!activeHeroVideo,
      });
    }
  }, [products, users, activeHeroVideo]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-green-500",
    },
    {
      title: "Productos Activos",
      value: stats.activeProducts,
      icon: "✅",
      color: "bg-purple-500",
    },
    {
      title: "Video Hero",
      value: stats.hasActiveVideo ? "Activo" : "Inactivo",
      icon: "🎬",
      color: stats.hasActiveVideo ? "bg-green-500" : "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Video Hero Status Card */}
      <Card>
        <Card.Header>
          <h3 className="flex items-center text-lg font-semibold">
            🎬 Estado del Video Hero
          </h3>
        </Card.Header>
        <Card.Content>
          {activeHeroVideo ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="mb-1 font-medium text-gray-900">
                  {activeHeroVideo.title}
                </h4>
                <p className="mb-2 text-sm text-gray-600">
                  {activeHeroVideo.description}
                </p>
                <div className="text-xs text-gray-500">
                  Creado:{" "}
                  {new Date(activeHeroVideo.createdAt).toLocaleDateString(
                    "es-MX"
                  )}
                </div>
              </div>
              <div className="flex flex-col ml-4 space-y-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Video Activo
                </span>
                <Link to="/admin/hero-videos">
                  <Button size="sm" variant="outline">
                    Gestionar Videos
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="mb-4 text-gray-400">
                <span className="text-4xl">🎬</span>
              </div>
              <h4 className="mb-2 font-medium text-gray-900">
                No hay video activo en el Hero
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Sube un video para mejorar la experiencia de los usuarios en la
                página principal
              </p>
              <Link to="/admin/hero-videos">
                <Button>Subir Video del Hero</Button>
              </Link>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Value Card */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Valor Total del Inventario</h3>
        </Card.Header>
        <Card.Content>
          <div className="text-3xl font-bold text-primary-600">
            ${stats.totalValue.toLocaleString("es-MX")}
          </div>
          <p className="mt-2 text-gray-600">
            Valor total basado en precio × stock de todos los productos
          </p>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Productos Recientes</h3>
          </Card.Header>
          <Card.Content>
            {products.slice(0, 5).map((product) => (
              <RecentItem key={product._id} item={product} type="product" />
            ))}
          </Card.Content>
        </Card>

        {/* Recent Users */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Usuarios Recientes</h3>
          </Card.Header>
          <Card.Content>
            {users.slice(0, 5).map((user) => (
              <RecentItem key={user._id} item={user} type="user" />
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
