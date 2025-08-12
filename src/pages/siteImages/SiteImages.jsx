import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const images = [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
  '/images/photo3.jpg',
  '/images/photo4.jpg',
  '/images/photo5.jpg',
  '/images/photo6.jpg',
];

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Gallery ${idx}`}
            className="cursor-pointer rounded shadow hover:scale-105 transition-transform"
            onClick={() => setSelectedImage(src)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              <FiX />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-[80vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
