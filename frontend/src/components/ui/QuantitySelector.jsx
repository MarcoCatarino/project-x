// frontend/src/components/ui/QuantitySelector.jsx
import { useState } from "react";

const QuantitySelector = ({ max, onQuantityChange, initialQuantity = 1 }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= max) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cantidad
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="text-lg font-medium min-w-[3rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= max}
          className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
