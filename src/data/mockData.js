// Datos hardcodeados para desarrollo sin APIs

// Usuarios mock
export const mockUsers = [
  {
    id: 1,
    email: 'vendedor@domotech.com',
    password: 'vendedor123',
    firstName: 'Juan',
    lastName: 'Vendedor',
    role: 'SELLER',
    isActive: true
  },
  {
    id: 2,
    email: 'cliente@domotech.com',
    password: 'cliente123',
    firstName: 'María',
    lastName: 'Cliente',
    role: 'BUYER',
    isActive: true
  }
];

// Categorías mock
export const mockCategories = [
  {
    id: 1,
    name: 'Iluminación Inteligente',
    description: 'Bombillas, lámparas y sistemas de iluminación conectados',
    isActive: true
  },
  {
    id: 2,
    name: 'Seguridad',
    description: 'Cámaras, sensores y sistemas de seguridad para el hogar',
    isActive: true
  },
  {
    id: 3,
    name: 'Climatización',
    description: 'Termostatos, aires acondicionados y sistemas de calefacción inteligentes',
    isActive: true
  },
  {
    id: 4,
    name: 'Entretenimiento',
    description: 'Altavoces, televisores y sistemas de audio inteligentes',
    isActive: true
  },
  {
    id: 5,
    name: 'Automatización',
    description: 'Interruptores, enchufes y dispositivos de automatización del hogar',
    isActive: true
  }
];

// Productos mock
export const mockProducts = [
  {
    productId: 1,
    name: 'Bombilla LED Inteligente WiFi',
    description: 'Bombilla LED de 9W con conectividad WiFi, control por app y cambio de color RGB',
    price: 25.99,
    discount: 5.00,
    stock: 50,
    brand: 'Philips Hue',
    active: true,
    category: {
      id: 1,
      name: 'Iluminación Inteligente'
    },
    principalImage: {
      imageId: 'bulb-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi 2.4GHz',
    compatibility: 'Alexa, Google Assistant, Apple HomeKit'
  },
  {
    productId: 2,
    name: 'Cámara de Seguridad IP',
    description: 'Cámara de seguridad con visión nocturna, detección de movimiento y almacenamiento en la nube',
    price: 89.99,
    discount: 0,
    stock: 25,
    brand: 'Ring',
    active: true,
    category: {
      id: 2,
      name: 'Seguridad'
    },
    principalImage: {
      imageId: 'camera-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi',
    compatibility: 'iOS, Android'
  },
  {
    productId: 3,
    name: 'Termostato Inteligente',
    description: 'Termostato programable con control remoto, ahorro de energía y compatibilidad con múltiples sistemas',
    price: 199.99,
    discount: 30.00,
    stock: 15,
    brand: 'Nest',
    active: true,
    category: {
      id: 3,
      name: 'Climatización'
    },
    principalImage: {
      imageId: 'thermostat-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi',
    compatibility: 'Google Assistant, Alexa'
  },
  {
    productId: 4,
    name: 'Altavoz Inteligente',
    description: 'Altavoz con asistente de voz, control de dispositivos inteligentes y sonido de alta calidad',
    price: 79.99,
    discount: 10.00,
    stock: 40,
    brand: 'Amazon Echo',
    active: true,
    category: {
      id: 4,
      name: 'Entretenimiento'
    },
    principalImage: {
      imageId: 'speaker-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi, Bluetooth',
    compatibility: 'Alexa'
  },
  {
    productId: 5,
    name: 'Enchufe Inteligente WiFi',
    description: 'Enchufe inteligente con control remoto, programación de horarios y monitoreo de consumo energético',
    price: 19.99,
    discount: 0,
    stock: 100,
    brand: 'TP-Link',
    active: true,
    category: {
      id: 5,
      name: 'Automatización'
    },
    principalImage: {
      imageId: 'outlet-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi',
    compatibility: 'Alexa, Google Assistant'
  },
  {
    productId: 6,
    name: 'Sensor de Movimiento PIR',
    description: 'Sensor de movimiento inalámbrico para automatización de luces y seguridad',
    price: 34.99,
    discount: 5.00,
    stock: 30,
    brand: 'Xiaomi',
    active: true,
    category: {
      id: 2,
      name: 'Seguridad'
    },
    principalImage: {
      imageId: 'sensor-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'Zigbee',
    compatibility: 'Xiaomi Home, Mi Home'
  },
  {
    productId: 7,
    name: 'Tira LED RGB Inteligente',
    description: 'Tira de LEDs RGB con control por app, efectos de iluminación y sincronización musical',
    price: 45.99,
    discount: 8.00,
    stock: 20,
    brand: 'Govee',
    active: true,
    category: {
      id: 1,
      name: 'Iluminación Inteligente'
    },
    principalImage: {
      imageId: 'led-strip-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi, Bluetooth',
    compatibility: 'Alexa, Google Assistant'
  },
  {
    productId: 8,
    name: 'Interruptor Inteligente',
    description: 'Interruptor de pared inteligente con control remoto y programación de horarios',
    price: 29.99,
    discount: 0,
    stock: 35,
    brand: 'Lutron',
    active: true,
    category: {
      id: 5,
      name: 'Automatización'
    },
    principalImage: {
      imageId: 'switch-1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    conectionType: 'WiFi',
    compatibility: 'Alexa, Google Assistant, Apple HomeKit'
  }
];

// Imágenes mock para productos
export const mockImages = {
  'bulb-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'camera-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'thermostat-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'speaker-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'outlet-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'sensor-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'led-strip-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'switch-1': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
};

// Carrito mock (se inicializa vacío)
export const mockCart = {
  id: 1,
  items: [],
  total: 0,
  itemCount: 0
};

// Función para simular delay de API
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Función para buscar productos
export const searchProducts = (query, page = 0, size = 12) => {
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  );
  
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = filteredProducts.slice(startIndex, endIndex);
  
  return {
    content,
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    page,
    size
  };
};

// Función para filtrar productos por categoría
export const getProductsByCategory = (categoryId, page = 0, size = 12) => {
  const filteredProducts = mockProducts.filter(product => 
    product.category.id === parseInt(categoryId)
  );
  
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = filteredProducts.slice(startIndex, endIndex);
  
  return {
    content,
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    page,
    size
  };
};

// Función para obtener catálogo con paginación
export const getCatalog = (page = 0, size = 12) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = mockProducts.slice(startIndex, endIndex);
  
  return {
    content,
    totalElements: mockProducts.length,
    totalPages: Math.ceil(mockProducts.length / size),
    page,
    size
  };
};

// Función para obtener producto por ID
export const getProductById = (id) => {
  return mockProducts.find(product => product.productId === parseInt(id));
};

// Función para obtener imágenes de un producto
export const getProductImages = (productId) => {
  const product = getProductById(productId);
  if (!product || !product.principalImage) return [];
  
  return [product.principalImage];
};
