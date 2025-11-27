import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../../store/slices/categoriesSlice';
import { Button } from '../common/Button';
import { ProductImageManager } from './ProductImageManager';
import { toast } from 'react-toastify';

export const ProductForm = ({ product, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    discount: '0',
    brand: '',
    compatibility: '',
    conectionType: '',
    categoryId: '',
    active: true,
  });

  useEffect(() => {
    dispatch(fetchAllCategories());
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        discount: product.discount || '0',
        brand: product.brand || '',
        compatibility: product.compatibility || '',
        conectionType: product.conectionType || '',
        categoryId: product.category?.categoryId || '',
        active: product.active !== undefined ? product.active : true,
      });
      
      if (product.images && product.images.length > 0) {
        // Identificar la imagen principal comparando con principalImage
        const principalImageId = product.principalImage?.imageId || product.principalImage?.id;
        
        const existingImages = product.images.map(img => {
          const imageId = img.imageId || img.id;
          // Marcar como principal si coincide con principalImage o si tiene isMain explícito
          const isMain = principalImageId === imageId || img.isMain === true;
          
          return {
            id: imageId,
            url: img.url,
            isMain: isMain,
            isNew: false,
          };
        });
        setImages(existingImages);
      } else if (product.principalImage) {
        // Si no hay array de imágenes pero hay principalImage, crear un array con esa imagen
        const principalImageId = product.principalImage.imageId || product.principalImage.id;
        setImages([{
          id: principalImageId,
          url: product.principalImage.url,
          isMain: true,
          isNew: false,
        }]);
      }
    }
  }, [product, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImagesChange = (updatedImages) => {
    setImages(updatedImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que haya al menos una imagen
    if (images.length === 0) {
      toast.error('Debes agregar al menos una imagen del producto');
      return;
    }
    
    onSubmit({
      ...formData,
      images: images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Nombre del Producto</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          placeholder="Ej: Sensor de Movimiento"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
          placeholder="Descripción del producto"
        />
      </div>

      {/* Gestor de Imágenes */}
      <ProductImageManager 
        images={images}
        onImagesChange={handleImagesChange}
        maxImages={5}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Precio</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 font-medium">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Descuento</label>
          <div className="relative">
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full pl-4 pr-9 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 font-medium">%</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Categoría</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Marca</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          placeholder="Marca del producto"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Compatibilidad</label>
        <input
          type="text"
          name="compatibility"
          value={formData.compatibility}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          placeholder="Ej: Alexa, Google Home"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Tipo de Conexión</label>
        <select
          name="conectionType"
          value={formData.conectionType}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
        >
          <option value="">Seleccionar tipo</option>
          <option value="WIFI">WiFi</option>
          <option value="BLUETOOTH">Bluetooth</option>
          <option value="ZIGBEE">Zigbee</option>
          <option value="ZWAVE">Z-Wave</option>
        </select>
      </div>

      {/* Estado del producto - Solo visible al editar */}
      {product && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-primary bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-all"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Producto Activo</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formData.active 
                  ? 'El producto está visible en el catálogo' 
                  : 'El producto está oculto del catálogo'}
              </span>
            </div>
          </label>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="submit" fullWidth>
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};