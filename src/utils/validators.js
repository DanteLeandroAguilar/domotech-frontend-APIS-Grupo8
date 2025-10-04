// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña (mínimo 6 caracteres)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validar número de teléfono
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validar campos requeridos
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Validar número positivo
export const isPositiveNumber = (value) => {
  return !isNaN(value) && parseFloat(value) > 0;
};