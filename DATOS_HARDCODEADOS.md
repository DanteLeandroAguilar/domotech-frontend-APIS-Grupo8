# Datos Hardcodeados - Domotech Frontend

Este proyecto ahora funciona con datos hardcodeados en lugar de APIs reales. Esto es útil para desarrollo y testing sin necesidad de un backend.

## Usuarios de Prueba

Puedes usar cualquiera de estos usuarios para probar la aplicación:

### Administrador
- **Email:** admin@domotech.com
- **Contraseña:** admin123
- **Rol:** ADMIN

### Vendedor
- **Email:** vendedor@domotech.com
- **Contraseña:** vendedor123
- **Rol:** SELLER

### Cliente
- **Email:** cliente@domotech.com
- **Contraseña:** cliente123
- **Rol:** CUSTOMER

## Productos Disponibles

La aplicación incluye 8 productos de ejemplo en diferentes categorías:

1. **Bombilla LED Inteligente WiFi** - $25.99 (con descuento de $5.00)
2. **Cámara de Seguridad IP** - $89.99
3. **Termostato Inteligente** - $199.99 (con descuento de $30.00)
4. **Altavoz Inteligente** - $79.99 (con descuento de $10.00)
5. **Enchufe Inteligente WiFi** - $19.99
6. **Sensor de Movimiento PIR** - $34.99 (con descuento de $5.00)
7. **Tira LED RGB Inteligente** - $45.99 (con descuento de $8.00)
8. **Interruptor Inteligente** - $29.99

## Categorías

- Iluminación Inteligente
- Seguridad
- Climatización
- Entretenimiento
- Automatización

## Funcionalidades Implementadas

### ✅ Autenticación
- Login con usuarios hardcodeados
- Registro de nuevos usuarios
- Gestión de sesiones con localStorage
- Diferentes roles (ADMIN, SELLER, CUSTOMER)

### ✅ Catálogo de Productos
- Lista de productos con paginación
- Búsqueda de productos
- Filtros por categoría, precio y marca
- Detalles de productos individuales

### ✅ Carrito de Compras
- Agregar productos al carrito
- Actualizar cantidades
- Eliminar productos
- Cálculo automático de totales

### ✅ Gestión de Imágenes
- URLs de imágenes hardcodeadas
- Imágenes de productos desde Unsplash

## Archivos Modificados

- `src/data/mockData.js` - Datos hardcodeados principales
- `src/api/endpoints/products.js` - API de productos con datos mock
- `src/api/endpoints/categories.js` - API de categorías con datos mock
- `src/api/endpoints/images.js` - API de imágenes con URLs hardcodeadas
- `src/api/endpoints/cart.js` - API de carrito con datos en memoria
- `src/api/endpoints/auth.js` - API de autenticación con usuarios mock
- `src/context/CartContext.jsx` - Contexto del carrito actualizado
- `src/context/AuthContext.jsx` - Contexto de autenticación actualizado

## Cómo Usar

1. Inicia la aplicación con `npm run dev`
2. Ve a la página de login
3. Usa cualquiera de los usuarios de prueba listados arriba
4. Explora el catálogo de productos
5. Agrega productos al carrito
6. Prueba las diferentes funcionalidades según tu rol

## Notas Importantes

- Los datos se mantienen en memoria durante la sesión
- Al recargar la página, el carrito se reinicia
- Los usuarios se mantienen en localStorage
- Las imágenes son URLs de Unsplash (requiere conexión a internet)
- Los delays de API están simulados para una experiencia realista

## Volver a APIs Reales

Para volver a usar APIs reales, simplemente revierte los cambios en los archivos de `src/api/endpoints/` y `src/context/` para que usen las llamadas HTTP originales en lugar de los datos hardcodeados.
