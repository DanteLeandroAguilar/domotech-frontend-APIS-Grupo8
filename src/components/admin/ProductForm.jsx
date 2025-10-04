import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/endpoints/categories';
import { Button } from '../common/Button';

export const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState([]);
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
  });

  useEffect(() => {
    loadCategories();
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
      });
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
          placeholder="Ej: Sensor de Movimiento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
          placeholder="Descripción del producto"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descuento</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
          placeholder="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
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
        <label className="block text-sm font-medium mb-1">Marca</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
          placeholder="Marca del producto"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Compatibilidad</label>
        <input
          type="text"
          name="compatibility"
          value={formData.compatibility}
          onChange={handleChange}
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
          placeholder="Ej: Alexa, Google Home"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Conexión</label>
        <select
          name="conectionType"
          value={formData.conectionType}
          onChange={handleChange}
          className="w-full bg-background-light dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary"
        >
          <option value="">Seleccionar tipo</option>
          <option value="WIFI">WiFi</option>
          <option value="BLUETOOTH">Bluetooth</option>
          <option value="ZIGBEE">Zigbee</option>
          <option value="ZWAVE">Z-Wave</option>
        </select>
      </div>

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