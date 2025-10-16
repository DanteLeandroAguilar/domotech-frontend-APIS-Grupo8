import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { authAPI } from '../api/endpoints/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(formData);
      authAPI.saveAuth(data.access_token);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <img src="/photo-domotech.png" alt="DomoTech" className="w-24 h-24 rounded-full object-cover shadow-md" />
          </div>
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bienvenido a DomoTech
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              inicia sesión o{' '}
              <Link to="/register" className="font-medium text-primary text-white hover:text-primary/80 transition-colors">
                crea una nueva cuenta
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;