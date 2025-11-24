import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatters";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  fetchMyOrders,
  resetConfirmState,
  selectConfirmError,
  selectConfirmStatus,
} from "../store/slices/ordersSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, getCartTotal } = useCart();
  const confirmStatus = useSelector(selectConfirmStatus);
  const confirmError = useSelector(selectConfirmError);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "credit_card",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    dispatch(confirmOrder());
  };

  useEffect(() => {
    if (!submitted) return;

    if (confirmStatus === "succeeded") {
      dispatch(fetchMyOrders());
      dispatch(resetConfirmState());
      setSubmitted(false);
      navigate("/order-summary");
    } else if (confirmStatus === "failed" && confirmError) {
      alert(confirmError);
      dispatch(resetConfirmState());
      setSubmitted(false);
    }
  }, [confirmStatus, confirmError, submitted, dispatch, navigate]);

  const total = getCartTotal();
  const isSubmitting = confirmStatus === "loading";

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
                    <label className="flex items-center p-4 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === "credit_card"}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-3 text-sm font-medium">
                        Tarjeta de Crédito
                      </span>
                    </label>
                    <label className="flex items-center p-4 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-3 text-sm font-medium">PayPal</span>
                    </label>
                  </div>
                </section>
              </div>

              {/* Resumen de la orden */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Resumen del Pedido
                  </h3>

                  <div className="space-y-4 mb-6">
                    {cart?.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          {item.productName} x {item.amount}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Subtotal
                      </span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    className="mt-6"
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Compra"}
                  </Button>
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
