import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/endpoints/auth';

// =============================================
// THUNKS (Acciones Asíncronas)
// =============================================

// Login de usuario
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials) => {
    const response = await authAPI.login(credentials);
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return {
      token: response.token,
      user: response.user || null
    };
  }
);

// Registro de usuario
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData) => {
    const response = await authAPI.register(userData);
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return {
      token: response.token,
      user: response.user || null
    };
  }
);

// Obtener información del usuario autenticado
export const fetchLoggedUser = createAsyncThunk(
  'user/fetchLoggedUser',
  async () => {
    const userData = await authAPI.getLoggedUser();
    return userData;
  }
);

// Cargar usuario desde token (al iniciar la app)
export const loadUserFromToken = createAsyncThunk(
  'user/loadFromToken',
  async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token');
    }

    // Decodificar token para obtener datos básicos
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        email: payload.sub,
        role: payload.role,
        userId: payload.userId
      }
    };
  }
);

// Actualizar perfil de usuario
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }) => {
    const response = await authAPI.updateUser(userId, userData);
    return response;
  }
);

// =============================================
// SLICE
// =============================================

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    // Logout (acción síncrona)
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ========== LOGIN ==========
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      });

    // ========== REGISTER ==========
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      });

    // ========== FETCH LOGGED USER ==========
    builder
      .addCase(fetchLoggedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchLoggedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // ========== LOAD FROM TOKEN ==========
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem('token');
      });

    // ========== UPDATE PROFILE ==========
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// =============================================
// EXPORTS
// =============================================

export const { logoutUser, clearError } = userSlice.actions;

// Selectores (para acceder al estado fácilmente)
export const selectUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserRole = (state) => state.user.currentUser?.role;

export default userSlice.reducer;