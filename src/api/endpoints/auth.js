 
import { mockUsers, simulateApiDelay } from '../../data/mockData';

export const authAPI = {
  // POST /auth/register
  register: async (userData) => {
    await simulateApiDelay();
    
    // Verificar si el email ya existe
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'BUYER', // Por defecto es cliente
      isActive: true
    };

    // Generar token simulado
    const token = `mock_token_${Date.now()}`;

    return {
      token,
      user: newUser
    };
  },

  // POST /auth/authenticate
  login: async (credentials) => {
    await simulateApiDelay();
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.isActive
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token simulado
    const token = `mock_token_${Date.now()}`;

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
      }
    };
  },

  // Guardar token y usuario en localStorage
  saveAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};