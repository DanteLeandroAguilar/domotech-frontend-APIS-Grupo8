import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto" style={{ backgroundColor: '#4D5D73' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex justify-center mb-4">
              <img src="/photo-domotech.png" alt="DomoTech" className="w-24 h-24 rounded-full object-cover shadow-md" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center" style={{color:'#ffff'}}>
              Tu marketplace de confianza para productos de domótica y automatización del hogar.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white text-gray-600 dark:text-gray-400 hover:text-[#05AFF2] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-sm text-white text-gray-600 dark:text-gray-400 hover:text-[#05AFF2] transition-colors">
                  Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contacto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400" style={{color:'#ffff'}}>
              Email: info@domotech.com<br />
              Teléfono: +54 11 1234-5678
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400" style={{color:'#ffff'}}>
            © 2025 DomoTech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};