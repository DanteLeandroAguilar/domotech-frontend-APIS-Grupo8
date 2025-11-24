import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categoriesSlice';

export const ProductFilters = ({ onFilterChange }) => {
  const [categoriesFilter, setCategoriesFilter] = useState([]);
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const [filters, setFilters] = useState({
    categoryId: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    compatibility: '',
    connectionType: '',
    withDiscount: false,
  });

  useEffect(() => {
    if (!categories || categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories]);

  // Mantener un array local para evitar mutaciones accidentales del store
  useEffect(() => {
    setCategoriesFilter(categories || []);
  }, [categories]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const activeFilters = {};
    
    // Solo enviar los filtros que tienen valor
    if (filters.categoryId) activeFilters.categoryId = filters.categoryId;
    if (filters.brand) activeFilters.brand = filters.brand;
    if (filters.minPrice) activeFilters.minPrice = parseFloat(filters.minPrice);
    if (filters.maxPrice) activeFilters.maxPrice = parseFloat(filters.maxPrice);
    if (filters.compatibility) activeFilters.compatibility = filters.compatibility;
    if (filters.connectionType) activeFilters.connectionType = filters.connectionType;
    if (filters.withDiscount) activeFilters.withDiscount = filters.withDiscount;

    onFilterChange(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categoryId: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      compatibility: '',
      connectionType: '',
      withDiscount: false,
    });
    onFilterChange({});
  };

  const connectionTypes = [
    { value: 'WIFI', label: 'WiFi' },
    { value: 'BLUETOOTH', label: 'Bluetooth' },
    { value: 'ZIGBEE', label: 'Zigbee' },
    { value: 'ZWAVE', label: 'Z-Wave' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24 shadow-xl border-2 border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Filtros
        </h2>
      </div>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700 dark:text-gray-200 text-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categoría
          </label>
          <div className="relative">
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer appearance-none"
            >
              <option value="">Todas las categorías</option>
              {categoriesFilter.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rango de Precio */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700 dark:text-gray-200 text-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Rango de Precio
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">$</span>
              </div>
              <input
                type="number"
                placeholder="Mín"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                min="0"
                step="0.01"
                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">$</span>
              </div>
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                min="0"
                step="0.01"
                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700 dark:text-gray-200 text-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Marca
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar marca..."
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            />
          </div>
        </div>

        {/* Compatibilidad */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700 dark:text-gray-200 text-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Compatibilidad
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Ej: Alexa, Google Home..."
              value={filters.compatibility}
              onChange={(e) => handleFilterChange('compatibility', e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            />
          </div>
        </div>

        {/* Tipo de Conexión */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-gray-700 dark:text-gray-200 text-sm">
            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            Tipo de Conexión
          </label>
          <div className="relative">
            <select
              value={filters.connectionType}
              onChange={(e) => handleFilterChange('connectionType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer appearance-none"
            >
              <option value="">Todos los tipos</option>
              {connectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Con Descuento */}
        <div>
          <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-2 border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              checked={filters.withDiscount}
              onChange={(e) => handleFilterChange('withDiscount', e.target.checked)}
              className="w-5 h-5 text-primary bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-all"
            />
            <div className="flex items-center gap-2 flex-1">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Solo con descuento
              </span>
            </div>
          </label>
        </div>

        {/* Botones */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Aplicar Filtros
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};