import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  // Calcular subtotal sin descuentos (precio original * cantidad)
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.amount), 0);
  
  // Calcular total con descuentos aplicados usando finalPrice del backend
  const total = cart.items.reduce((total, item) => {
    return total + (item.finalPrice || (item.price * item.amount));
  }, 0);
  
  // Calcular el monto total de descuentos
  const discounts = subtotal - total;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="sticky top-24">
      <div className="rounded-xl bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-b-2 border-primary/20 dark:border-primary/30 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Resumen del Pedido
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-base font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>

            {discounts > 0 && (
              <div className="flex justify-between items-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3">
                <span className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">local_offer</span>
                  Descuentos
                </span>
                <span className="text-base font-bold text-green-600 dark:text-green-400">
                  -{formatPrice(discounts)}
                </span>
              </div>
            )}

            <div className="border-t-2 border-gray-200 dark:border-gray-700 my-4"></div>

            <div className="flex justify-between items-center py-3 bg-primary/5 dark:bg-primary/10 rounded-lg px-4">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-primary dark:text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            fullWidth
            onClick={handleCheckout}
            className="mt-6 flex items-center justify-center gap-2 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span>Proceder al Checkout</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
};