import { useState, useEffect } from 'react';
import { Upload, X, Star } from 'lucide-react';
import { Button } from '../common/Button';
import { imagesAPI } from '../../api/endpoints/images';

export const ProductImageManager = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Sincronizar con las imágenes que vienen por props
  useEffect(() => {
    if (images && images.length > 0) {
      // Convertir las imágenes existentes al formato esperado
      const formattedImages = images.map(img => {
        // Si ya tiene URL, usarla; si no, construirla desde imageId
        let imageUrl = img.url;
        if (!imageUrl && (img.imageId || img.id)) {
          imageUrl = imagesAPI.getImageUrl(img.imageId || img.id);
        }
        
        return {
          id: img.imageId || img.id,
          imageId: img.imageId || img.id,
          url: imageUrl,
          isMain: img.isMain || false,
          isNew: img.isNew || false,
          file: img.file // Solo existirá en imágenes nuevas
        };
      });
      setPreviewImages(formattedImages);
    } else {
      setPreviewImages([]);
    }
  }, [images]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (previewImages.length + files.length > maxImages) {
      alert(`Solo puedes subir un máximo de ${maxImages} imágenes`);
      return;
    }

    const newImages = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isMain: previewImages.length === 0 && index === 0,
      isNew: true,
    }));

    const updatedImages = [...previewImages, ...newImages];
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    handleFiles(files);
  };

  const handleRemoveImage = (imageId) => {
    const updatedImages = previewImages.filter(img => img.id !== imageId);
    
    // Si se elimina la imagen principal, hacer que la primera sea la principal
    if (updatedImages.length > 0) {
      const hasMain = updatedImages.some(img => img.isMain);
      if (!hasMain) {
        updatedImages[0].isMain = true;
      }
    }
    
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleSetMainImage = (imageId) => {
    const updatedImages = previewImages.map(img => ({
      ...img,
      isMain: img.id === imageId,
    }));
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);
  };

  // Cleanup: Revocar URLs de objetos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      previewImages.forEach(img => {
        if (img.isNew && img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [previewImages]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          Imágenes del Producto ({previewImages.length}/{maxImages})
        </label>
      </div>

      {/* Upload Area */}
      {previewImages.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 dark:border-gray-700'
          }`}
        >
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="text-primary font-semibold">Haz clic para subir</span> o
              arrastra las imágenes aquí
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, WEBP hasta 5MB
            </p>
          </label>
        </div>
      )}

      {/* Image Preview Grid */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previewImages.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                image.isMain
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetMainImage(image.id)}
                  className={`p-2 rounded-full ${
                    image.isMain
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-yellow-500 hover:text-white'
                  } transition-colors`}
                  title={image.isMain ? 'Imagen principal' : 'Establecer como principal'}
                >
                  <Star className="w-4 h-4" fill={image.isMain ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Badge */}
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Principal
                </div>
              )}

              {/* New Badge */}
              {image.isNew && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  Nueva
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {previewImages.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No hay imágenes cargadas. Agrega al menos una imagen del producto.
        </p>
      )}
    </div>
  );
};