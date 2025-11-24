import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { categoriesAPI } from '../api/endpoints/categories'

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

// llama a la API categoriesAPI.getAll() Y guarda la lista de categorías en el estado/store
export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const response = await categoriesAPI.getAll()
  return response
})

// obtiene una categoria por id y la guarda en la lista de categorias
export const fetchCategoryById = createAsyncThunk('categories/fetchById', async (id) => {
  const response = await categoriesAPI.getById(id)
  return response
})

/*
Busco si el item existe y lo actualizo o lo agrego.
Los handlers de los extraReducers se encargan de actualizar el estado según la acción realizada.
*/

// crea una nueva categoria en el backend y el reducer añade la nueva categoria a la lista de categorias
export const createCategory = createAsyncThunk('categories/create', async (categoryData) => {
  const response = await categoriesAPI.create(categoryData)
  return response
})

// manda la actualización de una categoría al backend y actualiza la categoría en la lista de categorias con la respuesta
export const updateCategory = createAsyncThunk('categories/update', async ({ id, categoryData }) => {
  const response = await categoriesAPI.update(id, categoryData)
  return response
})

// elimina la categoria en el backend y el reducer filtra la lista de categorias para eliminarla
export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await categoriesAPI.delete(id)
  return id
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    
    clearCategories(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })

      // fetchCategoryById
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        const cat = action.payload
        const getId = (o) => o.id ?? o.categoryId ?? o.category_id
        const id = getId(cat)
        const idx = state.items.findIndex((c) => getId(c) === id)
        if (idx !== -1) state.items[idx] = cat
        else state.items.push(cat)
      })

      // createCategory
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload
        const getId = (o) => o.id ?? o.categoryId ?? o.category_id
        const id = getId(updated)
        const idx = state.items.findIndex((c) => getId(c) === id)
        if (idx !== -1) state.items[idx] = updated
      })

      // deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const id = action.payload
        const getId = (o) => o.id ?? o.categoryId ?? o.category_id
        state.items = state.items.filter((c) => getId(c) !== id)
      })
  },
})

export const { clearCategories } = categoriesSlice.actions

export default categoriesSlice.reducer
