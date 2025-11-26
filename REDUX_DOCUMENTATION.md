# 📚 Documentación de Redux - DomoTech Frontend

## 🏪 **1. productSlice.js**

### **¿Qué hace?**
Maneja todo el estado relacionado con productos:
- Lista de productos
- Producto actual (cuando ves detalles)
- Filtros (búsqueda, categorías, precios)
- Paginación
- Loading y errores

### **Estado inicial:**
```javascript
{
  products: [],           // Array de productos
  currentProduct: null,   // Producto seleccionado
  filters: {
    categoryId: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    searchTerm: '',
    compatibility: null,
    connectionType: null,
    withStock: null,
    withDiscount: null,
  },
  pagination: {
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
  loading: false,
  error: null,
  stockCheck: null,
}
```

### **Thunks asíncronos (llaman API):**
- `fetchCatalog` - Obtener catálogo público con paginación
- `fetchProductById` - Obtener un producto específico por ID
- `searchProducts` - Buscar productos por término
- `fetchProductsByCategory` - Obtener productos de una categoría
- `filterProducts` - Filtrar con múltiples criterios
- `checkProductStock` - Verificar stock disponible
- `createProduct` - Crear nuevo producto (solo SELLER)
- `updateProduct` - Actualizar producto existente (solo SELLER)
- `updateProductStock` - Actualizar stock (solo SELLER)
- `applyProductDiscount` - Aplicar descuento (solo SELLER)
- `removeProductDiscount` - Quitar descuento (solo SELLER)
- `deleteProduct` - Eliminar producto (solo SELLER)
- `fetchAllProducts` - Obtener todos los productos (ADMIN)

### **Reducers síncronos:**
- `setFilters` - Actualizar filtros localmente
- `clearFilters` - Limpiar todos los filtros
- `setPagination` - Actualizar paginación
- `clearCurrentProduct` - Limpiar producto actual
- `clearError` - Limpiar error
- `clearStockCheck` - Limpiar verificación de stock
- `resetProductState` - Resetear estado completo

### **Selectores:**
```javascript
selectProducts(state)         // Lista de productos
selectCurrentProduct(state)   // Producto actual
selectFilters(state)          // Filtros activos
selectPagination(state)       // Info de paginación
selectLoading(state)          // Estado de carga
selectError(state)            // Errores
selectStockCheck(state)       // Verificación de stock
```

### **Dónde se usa:**
- **Catalog.jsx** - Para mostrar y filtrar productos del catálogo
- **ProductDetail.jsx** - Para ver detalles de un producto específico
- **ProductManagement.jsx** - Para CRUD de productos (admin)
- **Home.jsx** - Para mostrar productos destacados

---

## 🛒 **2. cartItemsSlice.js**

### **¿Qué hace?**
Maneja el array de items del carrito del usuario:
- Lista de items (productId, amount)
- Loading de operaciones sobre items
- Errores de operaciones

### **Estado inicial:**
```javascript
{
  items: [],      // Array de items del carrito
  loading: false, // Estado de carga de operaciones
  error: null     // Errores
}
```

### **Thunks asíncronos:**
- `updateCartItemAmount` - Actualizar cantidad de un producto en el carrito

### **Reducers síncronos:**
- `setCartItems` - Setear items desde el servidor
- `clearCartItems` - Vaciar todos los items del carrito
- `clearError` - Limpiar errores
- `resetCartItemsState` - Resetear estado completo

### **Selectores:**
```javascript
selectCartItems(state)        // Array de items
selectCartItemsLoading(state) // Loading de operaciones
selectCartItemsError(state)   // Errores
selectCartItemsCount(state)   // Total de items (calculado)
```

### **Dónde se usa:**
- **CartItem.jsx** - Botones de aumentar (+), disminuir (-), eliminar
- **ProductCard.jsx** - Botón "Agregar" al carrito desde el catálogo
- **ProductDetail.jsx** - Botón "Añadir al Carrito" desde detalles
- **Cart.jsx** - Sincroniza items al cargar el carrito
- **OrderSummary.jsx** - Limpia el carrito después de confirmar compra
- **App.jsx** - Calcula el contador del carrito en el header

---

## 🚀 **3. dispatch - ¿Para qué sirve?**

`dispatch` es la función que **dispara acciones** de Redux para cambiar el estado.

### **Tipos de acciones:**

#### **A) Thunk asíncrono (llama a la API):**
```javascript
// Con await - espera el resultado
await dispatch(updateProduct({ 
  id: 1, 
  productData: {...} 
})).unwrap();

// Sin await - fire and forget
dispatch(fetchProductById(id));
```

#### **B) Reducer síncrono (solo actualiza estado local):**
```javascript
dispatch(clearFilters());
dispatch(setPagination({ page: 0 }));
dispatch(setCartItems(items));
```

### **Cuándo usar `await`:**
| Situación | ¿Usar await? | Motivo |
|-----------|--------------|--------|
| Necesitas el resultado para continuar | ✅ SÍ | Esperas datos |
| Quieres capturar errores con try/catch | ✅ SÍ | Manejo de errores |
| useEffect inicial | ❌ NO | Redux maneja loading automáticamente |
| Reducer síncrono | ❌ NO | Es instantáneo |
| Actualizar UI después | ✅ SÍ | Evita mostrar datos desactualizados |

### **Ejemplo con await:**
```javascript
const handleSubmit = async (formData) => {
  try {
    // 1. Actualizar producto (espera a que termine)
    await dispatch(updateProduct({ id, productData })).unwrap();
    
    // 2. Actualizar stock (espera a que termine)
    await dispatch(updateProductStock({ id, stockData })).unwrap();
    
    // 3. Recargar lista (espera para mostrar datos actualizados)
    await dispatch(fetchAllProducts()).unwrap();
    
    toast.success('Producto actualizado');
  } catch (error) {
    toast.error('Error al actualizar');
  }
};
```

### **Ejemplo sin await:**
```javascript
useEffect(() => {
  // Carga inicial - Redux maneja el estado automáticamente
  dispatch(fetchProductById(id));
}, [id, dispatch]);
```

---

## 👀 **4. useSelector - ¿Para qué sirve?**

`useSelector` lee (observa) datos del estado de Redux. Cuando el estado cambia, **re-renderiza automáticamente** el componente.

### **Ejemplos de uso:**

#### **A) Selector simple:**
```javascript
import { useSelector } from 'react-redux';

const products = useSelector((state) => state.products.products);
const loading = useSelector((state) => state.products.loading);
```

#### **B) Selector con función importada:**
```javascript
import { selectCartItemsLoading } from '../redux/cartItemsSlice';

const loading = useSelector(selectCartItemsLoading);
```

#### **C) Selector calculado (memoizado):**
```javascript
// En el slice:
export const selectCartItemsCount = (state) => {
  const items = state.cartItems.items || [];
  return items.reduce((total, item) => total + (item.amount || 0), 0);
};

// En el componente:
const cartCount = useSelector(selectCartItemsCount);
// ☝️ Se recalcula automáticamente cuando items cambia
```

### **Ventajas:**
1. ✅ Componentes se actualizan automáticamente cuando cambia Redux
2. ✅ No necesitas pasar props por múltiples niveles (no props drilling)
3. ✅ El componente solo se re-renderiza si SU parte del estado cambió
4. ✅ Código más limpio y mantenible

---

## 🎯 **Flujo completo de ejemplo:**

### **Caso: Agregar producto al carrito desde ProductCard**

```javascript
// 1. En ProductCard.jsx
const handleAddToCart = async (e) => {
  e.preventDefault();
  
  try {
    // 2. Obtener cantidad actual del carrito
    const cart = await cartAPI.getMyCart();
    const existingItem = cart?.items?.find(
      (it) => it.productId === product.productId
    );
    const currentAmount = existingItem ? existingItem.amount : 0;
    const newAmount = currentAmount + 1;

    // 3. DISPATCH - Actualizar en servidor y Redux
    await dispatch(updateCartItemAmount({ 
      productId: product.productId, 
      amount: newAmount 
    })).unwrap();
    
    // 4. Redux actualiza automáticamente:
    //    - cartItems.items se actualiza
    //    - cartItems.loading: true → false
    
    console.log('Producto agregado al carrito');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### **En App.jsx (contador del header):**
```javascript
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from './redux/cartItemsSlice';

function App() {
  // SELECTOR - Lee y recalcula automáticamente
  const cartItemsCount = useSelector(selectCartItemsCount);
  
  // Cuando items cambia en Redux:
  // 1. selectCartItemsCount recalcula el total
  // 2. cartItemsCount se actualiza
  // 3. App se re-renderiza
  // 4. Header muestra el nuevo número
  
  return (
    <>
      <AppRoutes cartItemsCount={cartItemsCount} />
    </>
  );
}
```

---

## 📊 **Flujo visual del ciclo de Redux:**

```
┌─────────────────────────────────────────────────────┐
│ Usuario hace clic en "Agregar al carrito"          │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ dispatch(updateCartItemAmount(...))                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Redux Toolkit ejecuta el thunk:                    │
│ 1. Despacha action.pending → loading: true         │
│ 2. Llama a la API                                   │
│ 3. API responde con items actualizados             │
│ 4. Despacha action.fulfilled → actualiza items     │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Redux Store se actualiza:                          │
│ - cartItems.items = [nuevos items]                 │
│ - cartItems.loading = false                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ useSelector detecta el cambio                      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ├──────────────┬──────────────────┐
                  ▼              ▼                  ▼
        ┌─────────────┐  ┌────────────┐  ┌──────────────┐
        │ App.jsx     │  │ Cart.jsx   │  │ CartItem.jsx │
        │ Actualiza   │  │ Actualiza  │  │ Actualiza    │
        │ contador    │  │ lista      │  │ botones      │
        └─────────────┘  └────────────┘  └──────────────┘
```

---

## 🔑 **Conceptos clave:**

| Concepto | Definición | Ejemplo |
|----------|------------|---------|
| **dispatch** | Función para enviar acciones (cambiar estado) | `dispatch(updateProduct(...))` |
| **useSelector** | Hook para leer estado (observar cambios) | `const items = useSelector(selectCartItems)` |
| **Thunk** | Acción asíncrona que llama a la API | `createAsyncThunk('products/fetch', ...)` |
| **Reducer** | Acción síncrona que modifica estado local | `clearFilters: (state) => {...}` |
| **unwrap()** | Convierte resultado Redux en promesa normal | `.unwrap()` para usar con try/catch |
| **Selector** | Función que extrae datos del estado | `(state) => state.products.products` |
| **Slice** | Conjunto de reducers, actions y estado inicial | `productSlice`, `cartItemsSlice` |

---

## 📝 **Buenas prácticas:**

### ✅ **DO (Hacer):**
1. Usa `await` cuando necesites el resultado para continuar
2. Usa `useSelector` para leer estado en lugar de props drilling
3. Crea selectores memoizados para cálculos complejos
4. Usa `.unwrap()` para mejor manejo de errores
5. Mantén los slices organizados por dominio (products, cart, etc.)

### ❌ **DON'T (No hacer):**
1. No uses `await` en useEffect inicial (Redux maneja el loading)
2. No uses `await` en reducers síncronos (son instantáneos)
3. No manipules el estado directamente sin Redux
4. No uses try-catch en los thunks (sin unwrap) - Redux lo maneja
5. No guardes datos duplicados entre slices

---

## 🛠️ **Herramientas útiles:**

### **Redux DevTools:**
Para debuggear en el navegador:
1. Instala la extensión Redux DevTools
2. Ve a la pestaña Redux en las DevTools
3. Observa cada acción que se dispara
4. Ve el estado antes y después de cada acción
5. Viaja en el tiempo (time travel debugging)

### **Estructura del store:**
```
store
├── products: productSlice
│   ├── products: []
│   ├── currentProduct: null
│   ├── filters: {...}
│   ├── pagination: {...}
│   ├── loading: false
│   └── error: null
│
└── cartItems: cartItemsSlice
    ├── items: []
    ├── loading: false
    └── error: null
```

---

## 🎓 **Resumen ejecutivo:**

Este proyecto usa Redux Toolkit para manejar dos dominios principales:

1. **Products** (productos): Catálogo, filtros, detalles, y gestión administrativa
2. **Cart Items** (items del carrito): Items del carrito del usuario con sus cantidades

**Redux nos permite:**
- ✅ Estado centralizado accesible desde cualquier componente
- ✅ Actualizaciones automáticas de UI cuando cambia el estado
- ✅ Código más limpio sin props drilling
- ✅ Mejor debugging con Redux DevTools
- ✅ Manejo consistente de async/loading/error states

**Sin Redux necesitaríamos:**
- ❌ Pasar props por múltiples niveles
- ❌ Múltiples useState y useEffect en cada componente
- ❌ Lógica de loading/error duplicada en todas partes
- ❌ Re-renders innecesarios de componentes

---

*Documentación creada para DomoTech Frontend - APIS Grupo 8*

