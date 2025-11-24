import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components/common/Header';
import { 
  fetchLoggedUser, 
  updateUserProfile, 
  selectUser, 
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError 
} from '../store/slices/userSlice';
import { ordersAPI } from '../api/endpoints/orders';
import { productsAPI } from '../api/endpoints/products';
import { imagesAPI } from '../api/endpoints/images';
import { toast } from 'react-toastify';

const Profile = ({ cartItemsCount }) => {
  const dispatch = useDispatch();
  
  // Estado de Redux
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  
  // Estado local
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    lastName: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [productImages, setProductImages] = useState({});

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchLoggedUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Actualizar formData cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  // Cargar órdenes cuando se cambia al tab de orders
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Cargar imágenes cuando cambian las órdenes
  useEffect(() => {
    if (orders.length > 0) {
      loadOrderProductImages();
    }
  }, [orders]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const ordersData = await ordersAPI.getMyOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setOrdersError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadOrderProductImages = async () => {
    try {
      const images = {};
      const token = localStorage.getItem('token');
      
      const productIds = new Set();
      orders.forEach(order => {
        order.details?.forEach(detail => {
          productIds.add(detail.productId);
        });
      });

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
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        name: user.name || '',
        lastName: user.lastName || '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
  e.preventDefault();
  
  try {
    await dispatch(updateUserProfile({
      userId: user.idUser,
      userData: formData
    })).unwrap();
    
    setIsEditing(false);
    setSaveSuccess(true);
    toast.success('Perfil actualizado correctamente');
    
    setTimeout(() => setSaveSuccess(false), 3000);
  } catch (err) {
    toast.error(err || 'Error al actualizar el perfil');
  }
};

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header cartItemsCount={cartItemsCount} />
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header cartItemsCount={cartItemsCount} />
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Debes iniciar sesión para ver tu perfil.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header cartItemsCount={cartItemsCount} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Perfil
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra tu información personal y consulta tus pedidos
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">person</span>
                  Información Personal
                </span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                  Mis Pedidos
                </span>
              </button>
            </nav>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información Personal
                </h2>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-200">
                    ✓ Perfil actualizado correctamente
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Error: {error}
                  </p>
                </div>
              )}

              {user ? (
                isEditing ? (
                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Usuario
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <p className="font-medium">{user.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Apellido</p>
                      <p className="font-medium">{user.lastName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium">{user.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
                      <p className="font-medium">{user.username || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Registro</p>
                      <p className="font-medium">{formatDate(user.registrationDate)}</p>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No se pudo obtener la información del usuario.
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
                                          <span>{formatPrice(detail.unitPrice)}</span>
                                          {detail.appliedDiscount > 0 && (
                                            <>
                                              <span>=</span>
                                              <span className="line-through">
                                                {formatPrice(detail.unitPrice * detail.quantity)}
                                              </span>
                                            </>
                                          )}
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