import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { imagesAPI } from '../../api/endpoints/images';
import { fetchImageBase64 } from '../../store/slices/imagesSlice';

export const ProductGallery = ({ images = [] }) => {
  const dispatch = useDispatch();
  const { base64Images, loadingImages } = useSelector((state) => state.images);
  const [selectedImage, setSelectedImage] = useState(0);

  // Cargar imágenes que no estén en el estado
  useEffect(() => {
    if (!images || images.length === 0) return;

    images.forEach((image) => {
      const imageId = image.imageId;
      // Solo cargar si no está en el estado y no está cargando
      if (imageId && !base64Images[imageId] && !loadingImages[imageId]) {
        dispatch(fetchImageBase64(imageId));
      }
    });
  }, [images, base64Images, loadingImages, dispatch]);

  // Generar URLs desde el estado
  const base64Urls = images.map((image) => {
    const imageId = image.imageId;
    if (base64Images[imageId]) {
      return `data:image/jpeg;base64,${base64Images[imageId]}`;
    }
    return imagesAPI.getImageUrl(imageId);
  });

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