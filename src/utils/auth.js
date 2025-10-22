// Utilidades de autenticación basadas en JWT almacenado en localStorage

const getToken = () => localStorage.getItem('token');

const decodeJwt = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const base64 = token.split('.')[1];
    if (!base64) return null;
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

export const getRolesFromPayload = (payload) => {
  if (!payload) return [];
  const authorities = Array.isArray(payload.authorities)
    ? payload.authorities.map((a) => (typeof a === 'string' ? a : a.authority)).filter(Boolean)
    : [];
  const roles = Array.isArray(payload.roles) ? payload.roles : [];
  const roleSingle = payload.role ? [payload.role] : [];
  return [...authorities, ...roles, ...roleSingle];
};

export const isSeller = () => {
  const payload = decodeJwt();
  const all = getRolesFromPayload(payload);
  return all.includes('SELLER');
};

export const isBuyer = () => {
  const payload = decodeJwt();
  const all = getRolesFromPayload(payload);
  return all.includes('BUYER');
};

export const getJwtPayload = () => decodeJwt();


