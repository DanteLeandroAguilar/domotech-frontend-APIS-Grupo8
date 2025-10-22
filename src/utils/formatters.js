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