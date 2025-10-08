import { Header } from '../components/common/Header';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-6xl">
                person
              </span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.username}
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Rol: {user?.role === 'BUYER' ? 'Comprador' : 'Vendedor'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Información del Perfil</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Aquí podrás ver y editar tu información personal en futuras actualizaciones.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;