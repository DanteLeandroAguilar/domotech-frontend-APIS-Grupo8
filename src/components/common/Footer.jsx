import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto" style={{ backgroundColor: '#4D5D73' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

          {/* Nuestras Redes */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Nuestras Redes</h3>
            <div className="flex items-center justify-center md:justify-start space-x-6">
              <a target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-[#05AFF2] transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.35 3.608 1.325.975.975 1.262 2.242 1.324 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.35 2.633-1.325 3.608-.975.975-2.242 1.262-3.608 1.324-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.35-3.608-1.325C2.7 19.655 2.413 18.388 2.351 17.022 2.293 15.757 2.282 15.377 2.282 12.173s.012-3.584.07-4.849c.062-1.366.35-2.633 1.325-3.608.975-.975 2.242-1.262 3.608-1.324C8.551 2.175 8.931 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.773.13 4.635.428 3.678 1.385 2.72 2.342 2.423 3.48 2.365 4.758 2.307 6.038 2.293 6.447 2.293 9.706v4.588c0 3.259.014 3.668.072 4.948.058 1.279.356 2.417 1.313 3.374.957.957 2.095 1.255 3.374 1.313 1.28.058 1.689.0 4.948.072s3.668-.014 4.948-.072c1.279-.058 2.417-.356 3.374-1.313.957-.957 1.255-2.095 1.313-3.374.058-1.28.072-1.689.072-4.948V9.706c0-3.259-.014-3.668-.072-4.948-.058-1.279-.356-2.417-1.313-3.374C19.365.428 18.227.13 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm7.842-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                </svg>
              </a>
              <a target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-[#05AFF2] transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
                  <path d="M448.83 209.25a210.31 210.31 0 01-122.67-39.26v141.27a117.86 117.86 0 11-99.88-116v49.41a69.83 69.83 0 1069.83 69.83V0h73.62a134.77 134.77 0 001.08 17.31 136.93 136.93 0 0047.93 86.67 137.68 137.68 0 0077.09 27.8z"/>
                </svg>
              </a>
              <a target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white hover:text-[#05AFF2] transition-colors">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" fill="currentColor">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 11107.58 0c0 29.7-24.09 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.2-79.2-48.2 0-55.6 37.7-55.6 76.6V448h-92.7V148.9h89V196h1.3c12.4-23.5 42.6-48.2 87.7-48.2 93.8 0 111.1 61.8 111.1 142.3V448z"/>
                </svg>
              </a>
            </div>
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