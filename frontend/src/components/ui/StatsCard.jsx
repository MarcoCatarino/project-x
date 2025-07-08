// frontend/src/components/ui/StatsCard.jsx
import Card from "./Card.jsx";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Card className="overflow-hidden">
      <Card.Content className="p-6">
        <div className="flex items-center">
          <div className={`rounded-lg p-3 ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatsCard;
