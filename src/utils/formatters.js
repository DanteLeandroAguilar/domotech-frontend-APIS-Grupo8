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