import { useState, useEffect } from 'react';
import { imagesAPI } from '../../api/endpoints/images';

export const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [base64Urls, setBase64Urls] = useState([]);

  // Cargar imágenes en base64
  useEffect(() => {
    if (!images || images.length === 0) return;

    let isCancelled = false;

    const loadImages = async () => {
      try {
        const urls = await Promise.all(
          images.map(async (image) => {
            try {
              const base64 = await imagesAPI.getImageBase64(image.imageId);
              return `data:image/jpeg;base64,${base64}`;
            } catch (e) {
              // Fallback a URL directa si falla
              return imagesAPI.getImageUrl(image.imageId);
            }
          })
        );
        if (!isCancelled) {
          setBase64Urls(urls);
        }
      } catch (e) {
        // En caso de error, dejamos que se usen las URLs directas
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500">Sin imágenes disponibles</span>
      </div>
    );
  }

  const mainImage = images[selectedImage];
  const mainImageUrl = base64Urls[selectedImage] || imagesAPI.getImageUrl(mainImage.imageId);

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={mainImageUrl}
          alt="Producto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.imageId}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-lg overflow-hidden h-20 transition-all ${
                selectedImage === index
                  ? 'ring-2 ring-primary'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={base64Urls[index] || imagesAPI.getImageUrl(image.imageId)}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};