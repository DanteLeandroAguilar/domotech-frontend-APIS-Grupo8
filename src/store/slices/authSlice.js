import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/endpoints/auth';

// Funciones helper para decodificar JWT
const decodeJwt = (token) => {
  try {
    if (!token) return null;
    const base64 = token.split('.')[1];
    if (!base64) return null;
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const getRolesFromPayload = (payload) => {
  if (!payload) return [];
  const authorities = Array.isArray(payload.authorities)
    ? payload.authorities.map((a) => (typeof a === 'string' ? a : a.authority)).filter(Boolean)
    : [];
  const roles = Array.isArray(payload.roles) ? payload.roles : [];
  const roleSingle = payload.role ? [payload.role] : [];
  return [...authorities, ...roles, ...roleSingle];
};

const getJwtPayload = (token) => {
  return decodeJwt(token);
};

const isSeller = (token) => {
  const payload = decodeJwt(token);
  const all = getRolesFromPayload(payload);
  return all.includes('SELLER');
};

const isBuyer = (token) => {
  const payload = decodeJwt(token);
  const all = getRolesFromPayload(payload);
  return all.includes('BUYER');
};

// Estado inicial
const token = localStorage.getItem('token') || null;
const initialState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  isSeller: isSeller(token),
  isBuyer: isBuyer(token),
  jwtPayload: getJwtPayload(token),
  loading: false,
  error: null,
  loginError: null,
  registerError: null,
  updateError: null,
};

// Thunk para login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await authAPI.login(credentials);
    return response;
  }
);

// Thunk para register
export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await authAPI.register(userData);
    return response;
  }
);

// Thunk para obtener información del usuario autenticado
export const getLoggedUser = createAsyncThunk(
  'auth/getLoggedUser',
  async () => {
    const response = await authAPI.getLoggedUser();
    return response;
  }
);

// Thunk para actualizar información del usuario
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ id, userData }) => {
    const response = await authAPI.updateUser(id, userData);
    return response;
  }
);

// Thunk para logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    return null;
  }
);

// Slice de auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.loginError = null;
      state.registerError = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.loginError = null;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.isSeller = isSeller(action.payload.access_token);
        state.isBuyer = isBuyer(action.payload.access_token);
        state.jwtPayload = getJwtPayload(action.payload.access_token);
        // Sincronizar con localStorage
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.loginError = error?.message || 'Error al iniciar sesión';
        state.isAuthenticated = false;
        state.token = null;
        state.isSeller = false;
        state.isBuyer = false;
        state.jwtPayload = null;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registerError = null;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.isSeller = isSeller(action.payload.access_token);
        state.isBuyer = isBuyer(action.payload.access_token);
        state.jwtPayload = getJwtPayload(action.payload.access_token);
        // Sincronizar con localStorage
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.registerError = error?.message || 'Error al registrarse';
        state.isAuthenticated = false;
        state.token = null;
        state.isSeller = false;
        state.isBuyer = false;
        state.jwtPayload = null;
      });

    // Obtener usuario autenticado
    builder
      .addCase(getLoggedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        // Actualizar roles basados en el token actual
        if (state.token) {
          state.isSeller = isSeller(state.token);
          state.isBuyer = isBuyer(state.token);
          state.jwtPayload = getJwtPayload(state.token);
        }
      })
      .addCase(getLoggedUser.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al obtener información del usuario';
        state.user = null;
      });

    // Actualizar usuario
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateError = null;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.updateError = error?.message || 'Error al actualizar información del usuario';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isSeller = false;
        state.isBuyer = false;
        state.jwtPayload = null;
        state.error = null;
        // Limpiar localStorage
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Aún así, limpiar el estado
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isSeller = false;
        state.isBuyer = false;
        state.jwtPayload = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

