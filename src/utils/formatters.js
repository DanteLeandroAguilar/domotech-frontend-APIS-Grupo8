// Formatear precio a moneda
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};

// Formatear fecha
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Calcular precio con descuento
export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!price || !discountPercent) return price;
  const percent = Math.min(Math.max(Number(discountPercent), 0), 100);
  return price * (1 - percent / 100);
};

// Calcular porcentaje de descuento
export const calculateDiscountPercentage = (price, discountPercent) => {
  if (!discountPercent) return 0;
  const percent = Math.min(Math.max(Number(discountPercent), 0), 100);
  return Math.round(percent);
};

// Obtener texto traducido del estado de una orden
export const getStatusText = (status) => {
  const texts = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    DELIVERED: 'Entregado',
    CANCELED: 'Cancelado',
  };
  return texts[status] || status;
};

// Obtener color de texto para el estado de una orden (sin fondo)
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'text-yellow-600 dark:text-yellow-400',
    CONFIRMED: 'text-blue-600 dark:text-blue-400',
    DELIVERED: 'text-green-600 dark:text-green-400',
    CANCELED: 'text-red-600 dark:text-red-400',
  };
  return colors[status] || 'text-gray-600 dark:text-gray-400';
};

// Obtener color de badge para el estado de una orden (con fondo)
export const getStatusBadgeColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

// Obtener color de badge para el estado de una orden (con fondo, variante para select)
export const getStatusBadgeColorSelect = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
  return colors[status] || colors.PENDING;
};