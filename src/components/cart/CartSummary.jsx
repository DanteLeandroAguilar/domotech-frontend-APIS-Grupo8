import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.amount), 0);
  const discounts = 0; // Puedes calcular descuentos aquí si los tienes
  const total = subtotal - discounts;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="sticky top-24">
      <div className="rounded-xl bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Resumen del Pedido
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discounts > 0 && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Descuentos</span>
              <span className="text-green-600 dark:text-green-400">
                -{formatPrice(discounts)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Button
          fullWidth
          onClick={handleCheckout}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <span>Proceder al Checkout</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
};