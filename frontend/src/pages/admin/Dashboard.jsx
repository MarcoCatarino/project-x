// frontend/src/pages/admin/Dashboard.jsx (REFACTORIZADA)
import { useEffect, useState } from "react";

import { useProductStore } from "../../store/productSotre.js";
import { useUserStore } from "../../store/userStore.js";

import Card from "../../components/ui/Card.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import StatsCard from "../../components/ui/StatsCard.jsx";
import RecentItem from "../../components/ui/RecentItem.jsx";

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();
  const { users, fetchUsers } = useUserStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts({ limit: 1000 }),
          fetchUsers({ limit: 1000 }),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProducts, fetchUsers]);

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
      });
    }
  }, [products, users]);

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
      title: "Sin Stock",
      value: stats.outOfStock,
      icon: "⚠️",
      color: "bg-red-500",
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

      {/* Value Card */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Valor Total del Inventario</h3>
        </Card.Header>
        <Card.Content>
          <div className="text-3xl font-bold text-primary-600">
            ${stats.totalValue.toLocaleString("es-MX")}
          </div>
          <p className="text-gray-600 mt-2">
            Valor total basado en precio × stock de todos los productos
          </p>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
