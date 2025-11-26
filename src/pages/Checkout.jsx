import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { fetchCart, clearCart } from '../store/slices/cartSlice';
import { confirmOrder } from '../store/slices/ordersSlice';
import { formatPrice } from '../utils/formatters';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirming } = useSelector((state) => state.orders);
  const { cart } = useSelector((state) => state.cart);
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
    
    const result = await dispatch(confirmOrder());
    if (confirmOrder.fulfilled.match(result)) {
      // Vaciar el carrito después de confirmar la orden exitosamente
      await dispatch(clearCart());
      toast.success('Orden confirmada');
      navigate('/order-summary');
    } else if (confirmOrder.rejected.match(result)) {
      toast.error(result.error?.message || 'Error al confirmar la orden');
    }
  };

  const total = getCartTotal();
  const subtotal = getCartSubtotal();
  const discounts = subtotal - total;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Información de Envío
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                        Dirección
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          placeholder="Av. Corrientes 1234"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          placeholder="Buenos Aires"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                          Provincia
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          placeholder="CABA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Método de Pago
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:shadow-primary/20 transition-all duration-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-white">
                        Tarjeta de Crédito / Débito
                      </span>
                    </label>
                    <label className="flex items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 has-[:checked]:shadow-lg has-[:checked]:shadow-primary/20 transition-all duration-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-white">PayPal</span>
                    </label>
                  </div>

                  {/* Formulario de Tarjeta de Crédito */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-5 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          name="cardHolderName"
                          value={formData.cardHolderName}
                          onChange={handleChange}
                          required
                          placeholder="Como aparece en la tarjeta"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                          Número de Tarjeta
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                            maxLength="19"
                            placeholder="•••• •••• •••• ••••"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
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
                              className="w-full pl-4 pr-11 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulario de PayPal */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="mt-6 space-y-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                          Email de PayPal
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            name="paypalEmail"
                            value={formData.paypalEmail}
                            onChange={handleChange}
                            required
                            placeholder="tu@email.com"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-400 flex items-start gap-2">
                          <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Serás redirigido a PayPal para completar tu pago de forma segura.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Resumen de la orden */}
              <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl sticky top-24 border-2 border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Resumen del Pedido
                  </h3>

                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item) => {
                      const discount = item.discount || 0;
                      const unitFinalPrice = item.price * (1 - discount / 100);
                      return (
                        <div key={item.id} className="flex justify-between text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex-1">
                            <span className="text-gray-700 dark:text-gray-200 font-medium">
                              {item.productName} x {item.amount}
                            </span>
                            {discount > 0 && (
                              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatPrice(item.finalPrice || (unitFinalPrice * item.amount))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Subtotal
                      </span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    {discounts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Descuentos
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          -{formatPrice(discounts)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={confirming}
                    className="mt-6"
                  >
                    {confirming ? 'Procesando...' : 'Confirmar Compra'}
                  </Button>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700/50 py-3 rounded-lg">
                    <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"></path>
                    </svg>
                    <span className="font-medium">Transacción segura garantizada</span>
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