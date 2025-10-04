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
export const calculateDiscountedPrice = (price, discount) => {
  return price - discount;
};

// Calcular porcentaje de descuento
export const calculateDiscountPercentage = (price, discount) => {
  if (!price || !discount) return 0;
  return Math.round((discount / price) * 100);
};