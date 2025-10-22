import { useState, useEffect } from 'react';
import { imagesAPI } from '../../api/endpoints/images';

export const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [blobUrls, setBlobUrls] = useState([]);

  // Cargar blobs de imágenes protegidas y crear Object URLs
  useEffect(() => {
    if (!images || images.length === 0) return;

    let isCancelled = false;
    let createdUrls = [];

    const loadBlobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const urls = await Promise.all(
          images.map(async (image) => {
            const url = imagesAPI.getImageUrl(image.imageId);
            const response = await fetch(url, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          })
        );
        createdUrls = urls;
        if (!isCancelled) {
          setBlobUrls(urls);
        }
      } catch (e) {
        // En caso de error, dejamos que se usen las URLs directas
      }
    };

    loadBlobs();

    return () => {
      isCancelled = true;
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
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
  const mainImageUrl = blobUrls[selectedImage] || imagesAPI.getImageUrl(mainImage.imageId);

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={mainImageUrl}
          alt="Producto"
          className="w-full h-full object-contain"
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
                src={blobUrls[index] || imagesAPI.getImageUrl(image.imageId)}
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