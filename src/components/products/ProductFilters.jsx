import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/endpoints/categories';

export const ProductFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brand, setBrand] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      console.log("categorias", data);
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleApplyFilters = () => {
    const filters = {};
    
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (brand) filters.brand = brand;

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setBrand('');
    onFilterChange({});
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Filtros
      </h2>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Categoría
          </h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de Precio */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Precio
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Marca */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Marca
          </h3>
          <input
            type="text"
            placeholder="Buscar marca..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Botones */}
        <div className="space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};