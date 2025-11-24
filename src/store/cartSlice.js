import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cartAPI } from '../api/endpoints/cart'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchCart = createAsyncThunk('cart/fetchMyCart', async () => {
  const response = await cartAPI.getMyCart()
  return response
})

// Update quantity for a product, then refetch cart to keep state consistent
export const updateProductAmount = createAsyncThunk(
  'cart/updateProductAmount',
  async ({ productId, amount }) => {
    await cartAPI.updateProductAmount(productId, amount)
    const refreshed = await cartAPI.getMyCart()
    return refreshed
  }
)

export const clearCartThunk = createAsyncThunk('cart/clearCart', async () => {
  const current = await cartAPI.getMyCart()
  const items = current?.items || []
  // Eliminar todos los productos
  await Promise.all(items.map((it) => cartAPI.updateProductAmount(it.productId, 0)))
  const refreshed = await cartAPI.getMyCart()
  return refreshed
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
    
    setCart(state, action) {
      state.items = action.payload || []
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload?.items || action.payload || []
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || action.payload
      })

      .addCase(updateProductAmount.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateProductAmount.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload?.items || action.payload || []
      })
      .addCase(updateProductAmount.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || action.payload
      })
  },
})

export const { clearCart, setCart } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items || []
export const selectCartQuantity = (state) =>
  (state.cart.items || []).reduce((sum, it) => sum + (it.amount || 0), 0)
export const selectCartTotal = (state) =>
  (state.cart.items || []).reduce((sum, it) => {
    const discount = it.discount || 0
    const unitFinal = it.price ? it.price * (1 - discount / 100) : it.finalPrice || 0
    const subtotal = it.finalPrice ?? unitFinal * (it.amount || 0)
    return sum + subtotal
  }, 0)

export default cartSlice.reducer
