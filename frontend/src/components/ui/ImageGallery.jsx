// frontend/src/components/ui/ImageGallery.jsx
import { useState } from "react";

const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-white rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]?.url}
          alt={`${productName} ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? "border-primary-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image.url}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
