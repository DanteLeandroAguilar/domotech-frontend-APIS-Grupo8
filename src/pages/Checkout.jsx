import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { cartAPI } from '../api/endpoints/cart';
import { ordersAPI } from '../api/endpoints/orders';
import { formatPrice } from '../utils/formatters';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    // Datos de tarjeta de crédito
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardHolderName: '',
    // Datos de PayPal
    paypalEmail: '',
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartAPI.getMyCart();
      setCart(data);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    // Usar finalPrice que ya viene calculado del backend
    return cart.items.reduce((total, item) => {
      return total + (item.finalPrice || (item.price * item.amount));
    }, 0);
  };

  const getCartSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.amount), 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      toast.error('Por favor completa los campos requeridos correctamente');
      form.reportValidity();
      return;
    }
    
    setLoading(true);
    try {
      await ordersAPI.confirm();
      toast.success('Orden confirmada');
      navigate('/order-summary');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la orden');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();
  const subtotal = getCartSubtotal();
  const discounts = subtotal - total;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Checkout
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulario de envío */}
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Información de Envío
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Provincia
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Método de Pago
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="ml-3 text-sm font-medium">
                        Tarjeta de Crédito / Débito
                      </span>
                    </label>
                    <label className="flex items-center p-4 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="ml-3 text-sm font-medium">PayPal</span>
                    </label>
                  </div>

                  {/* Formulario de Tarjeta de Crédito */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          name="cardHolderName"
                          value={formData.cardHolderName}
                          onChange={handleChange}
                          required
                          placeholder="Como aparece en la tarjeta"
                          className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                          Número de Tarjeta
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2,0,002-2V8a2 2,0,00-2-2H5a2 2,0,00-2 2v8a2 2,0,002 2z"></path>
                            </svg>
                          </span>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            maxLength="19"
                            placeholder="•••• •••• •••• ••••"
                            className="w-full pl-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Fecha de Expiración
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required
                            maxLength="5"
                            placeholder="MM/YY"
                            className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-1">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              name="cardCVV"
                              value={formData.cardCVV}
                              onChange={handleChange}
                              required
                              maxLength="4"
                              placeholder="•••"
                              className="w-full pr-10 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2,0,002-2v-6a2 2,0,00-2-2H6a2 2,0,00-2 2v6a2 2,0,002 2zm10-10V7a4 4,0,00-8 0v4h8z"></path>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulario de PayPal */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email de PayPal
                        </label>
                        <input
                          type="email"
                          name="paypalEmail"
                          value={formData.paypalEmail}
                          onChange={handleChange}
                          required
                          placeholder="tu@email.com"
                          className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                          Serás redirigido a PayPal para completar tu pago de forma segura.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Resumen de la orden */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Resumen del Pedido
                  </h3>

                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item) => {
                      const discount = item.discount || 0;
                      const unitFinalPrice = item.price * (1 - discount / 100);
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.productName} x {item.amount}
                            </span>
                            {discount > 0 && (
                              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                          <span className="font-medium">
                            {formatPrice(item.finalPrice || (unitFinalPrice * item.amount))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Subtotal
                      </span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    {discounts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Descuentos
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -{formatPrice(discounts)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="mt-6"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Compra'}
                  </Button>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                    <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"></path>
                    </svg>
                    <span>Transacción segura garantizada</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;