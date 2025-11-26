import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { updateUser } from '../store/slices/authSlice';
import { fetchMyOrders } from '../store/slices/ordersSlice';
import { imagesAPI } from '../api/endpoints/images';
import { roomsAPI } from '../api/endpoints/rooms';
import { toast } from 'react-toastify';
import { getStatusText, getStatusBadgeColor } from '../utils/formatters';

const Profile = () => {
  const dispatch = useDispatch();
  const { orders, loading: loadingOrders, error: ordersError } = useSelector((state) => state.orders);
  const { user: userInfo, loading, error, isAuthenticated, token, isBuyer } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    lastName: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders' o 'rooms'
  const [productImages, setProductImages] = useState({});
  const imagesLoadedRef = useRef(false);
  const ordersLengthRef = useRef(0);
  const productImagesRef = useRef({});
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingRoomName, setEditingRoomName] = useState('');

  // Asegurar que los vendedores no puedan acceder al tab de pedidos o habitaciones
  useEffect(() => {
    if (!isBuyer && (activeTab === 'orders' || activeTab === 'rooms')) {
      setActiveTab('profile');
    }
  }, [activeTab, isBuyer]);

  // Cargar habitaciones cuando se cambia al tab de habitaciones
  useEffect(() => {
    if (isBuyer && activeTab === 'rooms' && isAuthenticated) {
      loadRooms();
    }
  }, [activeTab, isBuyer, isAuthenticated]);

  // Inicializar formData solo cuando se carga el usuario por primera vez y no está editando
  useEffect(() => {
    if (userInfo && !isEditing && !formData.username) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        name: userInfo.name || '',
        lastName: userInfo.lastName || '',
      });
    }
  }, [userInfo, isEditing, formData.username]);

  // Cargar órdenes solo cuando se cambia a la pestaña de órdenes (solo para compradores)
  useEffect(() => {
    if (isBuyer && activeTab === 'orders' && userInfo && orders.length === 0 && !loadingOrders) {
      dispatch(fetchMyOrders());
    }
  }, [activeTab, userInfo, dispatch, orders.length, loadingOrders, isBuyer]);

  // Función para cargar imágenes de productos
  const loadOrderProductImages = useCallback(async () => {
    if (!token || orders.length === 0) return;
    
    try {
      const images = {};
      
      // Recopilar todos los productIds únicos de todas las órdenes
      const productIds = new Set();
      orders.forEach(order => {
        order.details?.forEach(detail => {
          productIds.add(detail.productId);
        });
      });

      // Cargar imágenes principales directamente usando imagesAPI.getPrincipal
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          try {
            // Obtener imagen principal directamente por productId
            const principal = await imagesAPI.getPrincipal(productId);
            const imageId = principal?.imageId;
            
            if (imageId) {
              const base64 = await imagesAPI.getImageBase64(imageId);
              images[productId] = `data:image/jpeg;base64,${base64}`;
            }
          } catch (error) {
            console.error(`Error al cargar imagen del producto ${productId}:`, error);
          }
        })
      );
      
      setProductImages(images);
      productImagesRef.current = images;
      imagesLoadedRef.current = true;
    } catch (error) {
      console.error('Error al cargar imágenes de productos:', error);
    }
  }, [orders, token]);

  // Cargar imágenes solo cuando cambia a la pestaña de órdenes y hay órdenes nuevas (solo para compradores)
  useEffect(() => {
    if (isBuyer && activeTab === 'orders' && orders.length > 0) {
      // Si cambió el número de órdenes, resetear el flag y cargar imágenes
      if (orders.length !== ordersLengthRef.current) {
        imagesLoadedRef.current = false;
        ordersLengthRef.current = orders.length;
      }
      
      if (!imagesLoadedRef.current && token) {
        loadOrderProductImages();
      }
    }
  }, [activeTab, orders.length, token, loadOrderProductImages, isBuyer]);

  // Limpiar imágenes cuando se cambia a la pestaña de perfil
  useEffect(() => {
    if (activeTab === 'profile') {
      imagesLoadedRef.current = false;
      // Limpiar Object URLs
      Object.values(productImagesRef.current).forEach((url) => URL.revokeObjectURL(url));
      productImagesRef.current = {};
      setProductImages({});
    }
  }, [activeTab]);

  // Limpiar Object URLs al desmontar el componente
  useEffect(() => {
    return () => {
      Object.values(productImagesRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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

  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const roomsData = await roomsAPI.getUserRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Error al cargar habitaciones:', error);
      toast.error('Error al cargar las habitaciones');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleCreateRoom = async () => {
    const trimmedName = editingRoomName.trim();
    if (!trimmedName) {
      toast.error('El nombre de la habitación no puede estar vacío');
      return;
    }

    try {
      await roomsAPI.createRoom(trimmedName);
      toast.success('Habitación creada correctamente');
      setEditingRoomName('');
      setEditingRoomId(null);
      await loadRooms();
    } catch (error) {
      toast.error(error.message || 'Error al crear la habitación');
    }
  };

  const handleUpdateRoom = async (roomId) => {
    const trimmedName = editingRoomName.trim();
    if (!trimmedName) {
      toast.error('El nombre de la habitación no puede estar vacío');
      return;
    }

    try {
      await roomsAPI.updateRoom(roomId, trimmedName);
      toast.success('Habitación actualizada correctamente');
      setEditingRoomName('');
      setEditingRoomId(null);
      await loadRooms();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar la habitación');
    }
  };

  const handleDeleteRoom = async (roomId, roomName) => {
    if (roomName.toLowerCase() === 'general') {
      toast.error('No se puede eliminar la habitación "general"');
      return;
    }

    try {
      await roomsAPI.deleteRoom(roomId);
      toast.success('Habitación eliminada correctamente');
      await loadRooms();
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la habitación');
    }
  };

  const startEditing = (room) => {
    setEditingRoomId(room.roomId);
    setEditingRoomName(room.name);
  };

  const cancelEditing = () => {
    setEditingRoomId(null);
    setEditingRoomName('');
  };

  // Ordenar órdenes por orderId descendente (más recientes primero)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.orderId - a.orderId);
  }, [orders]);

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
    setSaveSuccess(false);

    if (!userInfo?.idUser) {
      toast.error('No se pudo identificar al usuario');
      return;
    }

    const result = await dispatch(updateUser({ id: userInfo.idUser, userData: formData }));
    if (updateUser.fulfilled.match(result)) {
      setIsEditing(false);
      setSaveSuccess(true);
      toast.success('Perfil actualizado correctamente');
      setTimeout(() => setSaveSuccess(false), 3000);
    } else if (updateUser.rejected.match(result)) {
      toast.error(result.error?.message || 'Error al actualizar el perfil');
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
              {isBuyer && (
                <>
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
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === 'rooms'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    Habitaciones
                  </button>
                </>
              )}
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
          {activeTab === 'orders' && isBuyer && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
                </div>
              ) : ordersError ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                  <p className="text-red-600 dark:text-red-400">Error: {ordersError}</p>
                </div>
              ) : sortedOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">shopping_bag</span>
                  <p className="text-gray-600 dark:text-gray-400">No tienes pedidos aún</p>
                </div>
              ) : (
                sortedOrders.map((order) => (
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
                        className={`mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
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
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {detail.productName}
                                        </p>
                                        {detail.room && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                            {detail.room.charAt(0).toUpperCase() + detail.room.slice(1)}
                                          </span>
                                        )}
                                      </div>
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

          {/* Rooms Tab Content */}
          {activeTab === 'rooms' && isBuyer && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Gestión de Habitaciones
                </h2>
                {editingRoomId === null && (
                  <button
                    onClick={() => {
                      setEditingRoomId('new');
                      setEditingRoomName('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nueva Habitación
                  </button>
                )}
              </div>

              {loadingRooms ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  Cargando habitaciones...
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Crear nueva habitación */}
                  {editingRoomId === 'new' && (
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={editingRoomName}
                          onChange={(e) => setEditingRoomName(e.target.value)}
                          placeholder="Nombre de la habitación"
                          maxLength={50}
                          autoFocus
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateRoom();
                            } else if (e.key === 'Escape') {
                              cancelEditing();
                            }
                          }}
                        />
                        <button
                          onClick={handleCreateRoom}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lista de habitaciones */}
                  <div className="space-y-2">
                    {/* Habitación "general" (no editable) */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                          room
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          General
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Por defecto)
                        </span>
                      </div>
                    </div>

                    {/* Habitaciones del usuario */}
                    {rooms
                      .filter(room => room.name.toLowerCase() !== 'general')
                      .map((room) => (
                        <div
                          key={room.roomId}
                          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          {editingRoomId === room.roomId ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={editingRoomName}
                                onChange={(e) => setEditingRoomName(e.target.value)}
                                maxLength={50}
                                autoFocus
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateRoom(room.roomId);
                                  } else if (e.key === 'Escape') {
                                    cancelEditing();
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleUpdateRoom(room.roomId)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                                  room
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEditing(room)}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room.roomId, room.name)}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                                  title="Eliminar"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {rooms.length === 0 && editingRoomId !== 'new' && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No tienes habitaciones personalizadas. Crea una nueva para organizar tus productos.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
