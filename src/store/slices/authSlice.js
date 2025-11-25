import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/endpoints/auth';

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
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
        // Sincronizar con localStorage
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.loginError = error?.message || 'Error al iniciar sesión';
        state.isAuthenticated = false;
        state.token = null;
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
        // Sincronizar con localStorage
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.registerError = error?.message || 'Error al registrarse';
        state.isAuthenticated = false;
        state.token = null;
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
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

