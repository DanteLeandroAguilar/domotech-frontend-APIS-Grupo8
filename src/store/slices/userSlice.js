import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/endpoints/auth';

// Estado inicial
const initialState = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunks (acciones asíncronas)

// Login
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials) => {
    const response = await authAPI.login(credentials);
    
    // El backend devuelve { access_token: "..." }
    const token = response.access_token;
    
    // Guardar token en localStorage
    localStorage.setItem('token', token);
    
    // Decodificar JWT para obtener datos básicos
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        email: payload.sub,
        role: payload.role
      }
    };
  }
);

// Register
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData) => {
    const response = await authAPI.register(userData);
    
    // El backend devuelve { access_token: "..." }
    const token = response.access_token;
    
    // Guardar token en localStorage
    localStorage.setItem('token', token);
    
    // Decodificar JWT para obtener datos básicos
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        email: payload.sub,
        role: payload.role
      }
    };
  }
);

// Fetch logged user (GET /users/me)
export const fetchLoggedUser = createAsyncThunk(
  'user/fetchLoggedUser',
  async () => {
    const userData = await authAPI.getLoggedUser();
    return userData;
  }
);

// Load user from token (cuando refresca la página)
export const loadUserFromToken = createAsyncThunk(
  'user/loadUserFromToken',
  async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token');
    }
    
    // Decodificar JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      token,
      user: {
        email: payload.sub,
        role: payload.role
      }
    };
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }) => {
    const updatedUser = await authAPI.updateUser(userId, userData);
    return updatedUser;
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Logout (síncrono)
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
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
      });

    // Register
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
      });

    // Fetch logged user
    builder
      .addCase(fetchLoggedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedUser.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar con datos completos del backend
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        };
        state.error = null;
      })
      .addCase(fetchLoggedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Load user from token
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        // Limpiar localStorage si el token es inválido
        localStorage.removeItem('token');
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Exportar acciones
export const { logoutUser, clearError } = userSlice.actions;

// Selectores
export const selectUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectUserRole = (state) => state.user.currentUser?.role;

// Exportar reducer
export default userSlice.reducer;