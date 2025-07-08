// frontend/src/components/ui/RecentItem.jsx
const RecentItem = ({ item, type = "product" }) => {
  if (type === "product") {
    return (
      <div className="flex items-center py-3 border-b last:border-b-0">
        <img
          src={item.images[0]?.url || "/placeholder-image.jpg"}
          alt={item.name}
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{item.name}</p>
          <p className="text-xs text-gray-500">{item.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${item.price.toLocaleString("es-MX")}
          </p>
          <p className="text-xs text-gray-500">Stock: {item.stock}</p>
        </div>
      </div>
    );
  }

  // User type
  return (
    <div className="flex items-center py-3 border-b last:border-b-0">
      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-sm font-medium text-primary-600">
          {item.firstName?.[0]}
          {item.lastName?.[0]}
        </span>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {item.firstName} {item.lastName}
        </p>
        <p className="text-xs text-gray-500">{item.email}</p>
      </div>
      <div className="text-right">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.role}
        </span>
      </div>
    </div>
  );
};

export default RecentItem;
