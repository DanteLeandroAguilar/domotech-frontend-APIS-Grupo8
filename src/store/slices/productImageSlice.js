import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imagesAPI } from '../../api/endpoints/images';

// =============================================
// THUNKS (Acciones Asíncronas)
// =============================================

// Obtener todas las imágenes de un producto
export const fetchProductImages = createAsyncThunk(
  'productImage/fetchByProduct',
  async (productId) => {
    console.log(`🔄 Fetching images for product ${productId}...`);
    const images = await imagesAPI.getByProduct(productId);
    console.log(`✅ Fetched ${images.length} image(s) for product ${productId}:`, images);
    return { productId, images };
  }
);

// Obtener imagen principal de un producto
export const fetchPrincipalImage = createAsyncThunk(
  'productImage/fetchPrincipal',
  async (productId) => {
    const image = await imagesAPI.getPrincipal(productId);
    return { productId, image };
  }
);

// Subir nueva imagen a un producto
export const uploadProductImage = createAsyncThunk(
  'productImage/upload',
  async ({ productId, formData }) => {
    const response = await imagesAPI.upload(productId, formData);
    return { productId, image: response };
  }
);

// Marcar imagen como principal
export const markImageAsPrincipal = createAsyncThunk(
  'productImage/markAsPrincipal',
  async ({ productId, imageId }) => {
    await imagesAPI.markAsPrincipal(imageId);
    return { productId, imageId };
  }
);

// Eliminar imagen
export const deleteProductImage = createAsyncThunk(
  'productImage/delete',
  async ({ productId, imageId }) => {
    await imagesAPI.delete(imageId);
    return { productId, imageId };
  }
);

// =============================================
// SLICE
// =============================================

const productImageSlice = createSlice({
  name: 'productImage',
  initialState: {
    // Imágenes organizadas por productId
    imagesByProduct: {},
    // { 
    //   42: [{ imageId: 1, url: '...', isMain: true }, ...],
    //   58: [...]
    // }
    
    // Estados de carga por producto
    loading: {},
    // { 42: true, 58: false }
    
    // Errores por producto
    errors: {},
    // { 42: 'Error al cargar imágenes' }
    
    // Estado de subida de imágenes
    uploading: {},
    // { 42: { uploading: true, progress: 65 } }
  },
  reducers: {
    // Limpiar imágenes de un producto específico
    clearProductImages: (state, action) => {
      const productId = action.payload;
      console.log(`🗑️ Clearing images for product ${productId}`);
      delete state.imagesByProduct[productId];
      delete state.loading[productId];
      delete state.errors[productId];
      delete state.uploading[productId];
    },
    
    // Invalidar caché de un producto (forzar recarga)
    invalidateProductImages: (state, action) => {
      const productId = action.payload;
      console.log(`♻️ Invalidating cache for product ${productId}`);
      if (state.imagesByProduct[productId]) {
        state.imagesByProduct[productId] = [];
      }
      delete state.loading[productId];
      delete state.errors[productId];
    },
    
    // Limpiar todas las imágenes
    clearAllImages: (state) => {
      console.log('🗑️ Clearing all images');
      state.imagesByProduct = {};
      state.loading = {};
      state.errors = {};
      state.uploading = {};
    },
    
    // Limpiar error de un producto
    clearProductError: (state, action) => {
      const productId = action.payload;
      delete state.errors[productId];
    },
  },
  extraReducers: (builder) => {
    // ========== FETCH PRODUCT IMAGES ==========
    builder
      .addCase(fetchProductImages.pending, (state, action) => {
        const productId = action.meta.arg;
        state.loading[productId] = true;
        delete state.errors[productId];
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        const { productId, images } = action.payload;
        state.loading[productId] = false;
        state.imagesByProduct[productId] = images;
        console.log(`💾 Stored ${images.length} image(s) in Redux for product ${productId}`);
      })
      .addCase(fetchProductImages.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.loading[productId] = false;
        state.errors[productId] = action.error.message;
        console.error(`❌ Failed to fetch images for product ${productId}:`, action.error.message);
      });

    // ========== FETCH PRINCIPAL IMAGE ==========
    builder
      .addCase(fetchPrincipalImage.pending, (state, action) => {
        const productId = action.meta.arg;
        state.loading[productId] = true;
        delete state.errors[productId];
      })
      .addCase(fetchPrincipalImage.fulfilled, (state, action) => {
        const { productId, image } = action.payload;
        state.loading[productId] = false;
        
        // Si ya existen imágenes, actualizar la principal
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = state.imagesByProduct[productId].map(img =>
            img.imageId === image.imageId ? image : img
          );
        } else {
          state.imagesByProduct[productId] = [image];
        }
      })
      .addCase(fetchPrincipalImage.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.loading[productId] = false;
        state.errors[productId] = action.error.message;
      });

    // ========== UPLOAD IMAGE ==========
    builder
      .addCase(uploadProductImage.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.uploading[productId] = { uploading: true };
        delete state.errors[productId];
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        const { productId, image } = action.payload;
        state.uploading[productId] = { uploading: false };
        
        // Agregar la nueva imagen al array
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId].push(image);
        } else {
          state.imagesByProduct[productId] = [image];
        }
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.uploading[productId] = { uploading: false };
        state.errors[productId] = action.error.message;
      });

    // ========== MARK AS PRINCIPAL ==========
    builder
      .addCase(markImageAsPrincipal.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = true;
        delete state.errors[productId];
      })
      .addCase(markImageAsPrincipal.fulfilled, (state, action) => {
        const { productId, imageId } = action.payload;
        state.loading[productId] = false;
        
        // Actualizar isMain en todas las imágenes del producto
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = state.imagesByProduct[productId].map(img => ({
            ...img,
            isMain: img.imageId === imageId,
            isPrincipal: img.imageId === imageId  // Mantener ambos por compatibilidad
          }));
        }
      })
      .addCase(markImageAsPrincipal.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = false;
        state.errors[productId] = action.error.message;
      });

    // ========== DELETE IMAGE ==========
    builder
      .addCase(deleteProductImage.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = true;
        delete state.errors[productId];
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        const { productId, imageId } = action.payload;
        state.loading[productId] = false;
        
        // Eliminar imagen del array
        if (state.imagesByProduct[productId]) {
          state.imagesByProduct[productId] = state.imagesByProduct[productId].filter(
            img => img.imageId !== imageId
          );
        }
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.loading[productId] = false;
        state.errors[productId] = action.error.message;
      });
  },
});

// =============================================
// EXPORTS
// =============================================

export const { 
  clearProductImages, 
  invalidateProductImages,
  clearAllImages, 
  clearProductError 
} = productImageSlice.actions;

// =============================================
// SELECTORES (helpers para acceder al estado)
// =============================================

// Obtener todas las imágenes de un producto
export const selectProductImages = (productId) => (state) => 
  state.productImage.imagesByProduct[productId] || [];

// Obtener imágenes por productId (alternativa más usada)
export const selectImagesByProduct = (state, productId) => {
  const images = state.productImage.imagesByProduct[productId] || [];
  console.log(`📸 Selector - Product ${productId}: ${images.length} image(s)`, images);
  return images;
};

// Obtener imagen principal de un producto
export const selectPrincipalImage = (productId) => (state) => 
  state.productImage.imagesByProduct[productId]?.find(img => img.isMain || img.isPrincipal) || null;

// Estado de carga de imágenes (general)
export const selectImagesLoading = (state) => 
  Object.values(state.productImage.loading).some(loading => loading);

// Estado de carga de un producto específico
export const selectImageLoading = (productId) => (state) => 
  state.productImage.loading[productId] || false;

// Error de un producto específico
export const selectImageError = (productId) => (state) => 
  state.productImage.errors[productId] || null;

// Estado de subida de un producto
export const selectImageUploading = (productId) => (state) => 
  state.productImage.uploading[productId] || { uploading: false };

// Verificar si un producto tiene imágenes cargadas
export const selectHasImages = (state, productId) => 
  state.productImage.imagesByProduct[productId]?.length > 0;

export default productImageSlice.reducer;