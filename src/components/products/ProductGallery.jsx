import { useState } from 'react';

export const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500">Sin imágenes disponibles</span>
      </div>
    );
  }

  const mainImage = images[selectedImage];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative group">
        <img
          src={mainImage.url}
          alt={`Producto - Imagen ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
        
        {/* Indicador de imagen principal */}
        {mainImage.isMain && (
          <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Principal
          </div>
        )}

        {/* Navegación con flechas si hay más de una imagen */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagen siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Contador de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.imageId || index}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-lg overflow-hidden h-20 transition-all ${
                selectedImage === index
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Indicador de selección */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Badge de principal */}
              {image.isMain && (
                <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                  ★
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};