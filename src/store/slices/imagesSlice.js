import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imagesAPI } from '../../api/endpoints/images';

// Estado inicial
const initialState = {
  imagesByProduct: {}, // { productId: [images] }
  principalImages: {}, // { productId: image }
  base64Images: {}, // { imageId: base64String }
  loadingImages: {}, // { imageId: boolean } - Para evitar cargas duplicadas
  loading: false,
  error: null,
};

// Thunk para obtener todas las imágenes de un producto
export const fetchImagesByProduct = createAsyncThunk(
  'images/fetchImagesByProduct',
  async (productId) => {
    const response = await imagesAPI.getByProduct(productId);
    return { productId, images: response };
  }
);

// Thunk para obtener imagen principal de un producto
export const fetchPrincipalImage = createAsyncThunk(
  'images/fetchPrincipalImage',
  async (productId) => {
    const response = await imagesAPI.getPrincipal(productId);
    return { productId, image: response };
  }
);

// Thunk para obtener imagen en base64
export const fetchImageBase64 = createAsyncThunk(
  'images/fetchImageBase64',
  async (imageId) => {
    const base64 = await imagesAPI.getImageBase64(imageId);
    return { imageId, base64 };
  }
);

// Thunk para subir imagen (solo SELLER)
export const uploadImage = createAsyncThunk(
  'images/uploadImage',
  async ({ productId, formData }) => {
    const response = await imagesAPI.upload(productId, formData);
    return { productId, image: response };
  }
);

// Thunk para marcar imagen como principal (solo SELLER)
export const markImageAsPrincipal = createAsyncThunk(
  'images/markImageAsPrincipal',
  async ({ imageId, productId }) => {
    const response = await imagesAPI.markAsPrincipal(imageId);
    return { imageId, productId, image: response };
  }
);

// Thunk para eliminar imagen (solo SELLER)
export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async ({ imageId, productId }) => {
    await imagesAPI.delete(imageId);
    return { imageId, productId };
  }
);

// Slice de images
const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearImagesByProduct: (state, action) => {
      const productId = action.payload;
      if (productId) {
        delete state.imagesByProduct[productId];
        delete state.principalImages[productId];
      } else {
        state.imagesByProduct = {};
        state.principalImages = {};
      }
    },
    clearBase64Image: (state, action) => {
      const imageId = action.payload;
      if (imageId) {
        delete state.base64Images[imageId];
      } else {
        state.base64Images = {};
      }
    },
  },
  extraReducers: (builder) => {
    // Obtener imágenes por producto
    builder
      .addCase(fetchImagesByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImagesByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { productId, images } = action.payload;
        state.imagesByProduct[productId] = Array.isArray(images) ? images : [];
      })
      .addCase(fetchImagesByProduct.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar las imágenes del producto';
      });

    // Obtener imagen principal
    builder
      .addCase(fetchPrincipalImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrincipalImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { productId, image } = action.payload;
        if (image) {
          state.principalImages[productId] = image;
        }
      })
      .addCase(fetchPrincipalImage.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar la imagen principal';
      });

    // Obtener imagen en base64
    builder
      .addCase(fetchImageBase64.pending, (state, action) => {
        const imageId = action.meta.arg;
        // Solo marcar como loading si no está ya cargada
        if (!state.base64Images[imageId]) {
          state.loadingImages[imageId] = true;
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchImageBase64.fulfilled, (state, action) => {
        const { imageId, base64 } = action.payload;
        state.base64Images[imageId] = base64;
        delete state.loadingImages[imageId];
        // Solo cambiar loading global si no hay más imágenes cargando
        if (Object.keys(state.loadingImages).length === 0) {
          state.loading = false;
        }
        state.error = null;
      })
      .addCase(fetchImageBase64.rejected, (state, action) => {
        const imageId = action.meta.arg;
        delete state.loadingImages[imageId];
        // Solo cambiar loading global si no hay más imágenes cargando
        if (Object.keys(state.loadingImages).length === 0) {
          state.loading = false;
        }
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar la imagen en base64';
      });

    // Subir imagen
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { productId, image } = action.payload;
        // Agregar la nueva imagen a la lista del producto
        if (!state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = [];
        }
        state.imagesByProduct[productId].push(image);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al subir la imagen';
      });

    // Marcar imagen como principal
    builder
      .addCase(markImageAsPrincipal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markImageAsPrincipal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { productId, image } = action.payload;
        // Actualizar imagen principal
        state.principalImages[productId] = image;
        // Actualizar en la lista de imágenes del producto
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = state.imagesByProduct[productId].map(img =>
            img.imageId === image.imageId ? { ...img, isMain: true } : { ...img, isMain: false }
          );
        }
      })
      .addCase(markImageAsPrincipal.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al marcar la imagen como principal';
      });

    // Eliminar imagen
    builder
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { imageId, productId } = action.payload;
        // Eliminar de la lista de imágenes del producto
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = state.imagesByProduct[productId].filter(
            img => img.imageId !== imageId
          );
        }
        // Eliminar de base64 si existe
        delete state.base64Images[imageId];
        // Si era la imagen principal, limpiarla
        if (state.principalImages[productId]?.imageId === imageId) {
          delete state.principalImages[productId];
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al eliminar la imagen';
      });
  },
});

export const { clearError, clearImagesByProduct, clearBase64Image } = imagesSlice.actions;
export default imagesSlice.reducer;

