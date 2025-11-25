import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { authAPI } from '../api/endpoints/auth';
import { fetchMyOrders } from '../store/slices/ordersSlice';
import { productsAPI } from '../api/endpoints/products';
import { imagesAPI } from '../api/endpoints/images';

const Profile = () => {
  const dispatch = useDispatch();
  const { orders, loading: loadingOrders, error: ordersError } = useSelector((state) => state.orders);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    lastName: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' o 'orders'
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        const userData = await authAPI.getLoggedUser();
        setUserInfo(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          name: userData.name || '',
          lastName: userData.lastName || '',
        });
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated && orders.length === 0) {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, isAuthenticated, dispatch, orders.length]);

  // Cargar imágenes cuando cambian las órdenes
  useEffect(() => {
    if (orders.length > 0) {
      loadOrderProductImages();
    }
  }, [orders]);


  const loadOrderProductImages = async () => {
    try {
      const images = {};
      const token = localStorage.getItem('token');
      
      // Recopilar todos los productIds únicos de todas las órdenes
      const productIds = new Set();
      orders.forEach(order => {
        order.details?.forEach(detail => {
          productIds.add(detail.productId);
        });
      });

      // Cargar imágenes de todos los productos
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          try {
            const product = await productsAPI.getById(productId);
            
            if (product.principalImage?.imageId) {
              const imageUrl = imagesAPI.getImageUrl(product.principalImage.imageId);
              
              const response = await fetch(imageUrl, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });
              const blob = await response.blob();
              images[productId] = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error(`Error al cargar imagen del producto ${productId}:`, error);
          }
        })
      );
      
      setProductImages(images);
    } catch (error) {
      console.error('Error al cargar imágenes de productos:', error);
    }
  };

  // Limpiar Object URLs al desmontar el componente
  useEffect(() => {
    return () => {
      Object.values(productImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productImages]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const formatDiscount = (discount) => {
    return `${discount}%`;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      DELIVERED: 'Entregado',
      CANCELED: 'Cancelado',
    };
    return texts[status] || status;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
    // Restaurar los datos originales
    setFormData({
      username: userInfo.username || '',
      email: userInfo.email || '',
      name: userInfo.name || '',
      lastName: userInfo.lastName || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updatedUser = await authAPI.updateUser(userInfo.idUser, formData);
      setUserInfo(updatedUser);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setSaveError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-6xl">person</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {userInfo ? `${userInfo.name} ${userInfo.lastName}` : 'Mi Perfil'}
              </h1>
              {userInfo && (
                <>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">{userInfo.email}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Miembro desde {formatDate(userInfo.registrationDate)}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700/50 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                Pedidos
              </button>
            </nav>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
              ✓ Información actualizada correctamente
            </div>
          )}

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Información del Perfil</h2>
                {isAuthenticated && userInfo && !isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar
                  </button>
                )}
              </div>
              
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
              ) : error ? (
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
              ) : isAuthenticated ? (
                userInfo ? (
                  isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {saveError && (
                        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm">
                          {saveError}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Apellido
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Usuario
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                        <p className="font-medium">{userInfo.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Apellido</p>
                        <p className="font-medium">{userInfo.lastName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{userInfo.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
                        <p className="font-medium">{userInfo.username || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Registro</p>
                        <p className="font-medium">{formatDate(userInfo.registrationDate)}</p>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No se pudo obtener la información del usuario.
                  </p>
                )
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Debes iniciar sesión para ver tu información de perfil.
                </p>
              )}
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
                </div>
              ) : ordersError ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                  <p className="text-red-600 dark:text-red-400">Error: {ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">shopping_bag</span>
                  <p className="text-gray-600 dark:text-gray-400">No tienes pedidos aún</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Pedido #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <span
                        className={`mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="space-y-3">
                        {order.details && order.details.length > 0 ? (
                          order.details.map((detail) => (
                            <div key={detail.id} className="border-b border-gray-100 dark:border-gray-700/50 pb-3 last:border-b-0 last:pb-0">
                              <div className="flex gap-4">
                                {/* Imagen del producto */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                  {productImages[detail.productId] ? (
                                    <img
                                      src={productImages[detail.productId]}
                                      alt={detail.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="material-symbols-outlined text-gray-400">
                                        package_2
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Información del producto */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-4">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {detail.productName}
                                      </p>
                                      <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                          <span>Cantidad: {detail.quantity}</span>
                                          <span>×</span>
                                          {detail.appliedDiscount > 0 ? (
                                            <>
                                              <span className="line-through">
                                                {formatPrice(detail.unitPrice * detail.quantity)}
                                              </span>
                                            </>
                                          )
                                          :
                                          <span>{formatPrice(detail.unitPrice)}</span>
                                          }
                                        </div>
                                        {detail.appliedDiscount > 0 && (
                                          <div className="flex items-center gap-2 text-xs">
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                              ✓ Descuento aplicado: {formatDiscount(detail.appliedDiscount)}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              (Ahorro: {formatPrice(detail.unitPrice * detail.quantity - detail.subtotal)})
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatPrice(detail.subtotal)}
                                      </p>
                                      {detail.appliedDiscount > 0 && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                          con descuento
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No hay items en este pedido
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
