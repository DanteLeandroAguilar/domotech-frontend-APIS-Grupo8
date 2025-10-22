import { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { CategoryTable } from '../../components/admin/CategoryTable';
import { Loading } from '../../components/common/Loading';
import { categoriesAPI } from '../../api/endpoints/categories';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.categoryId, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await categoriesAPI.create(formData);
        toast.success('Categoría creada correctamente');
      }
      
      setShowForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      toast.error(error.response?.data?.message || 'Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      return;
    }

    try {
      await categoriesAPI.delete(categoryId);
      toast.success('Categoría eliminada correctamente');
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Gestionar Categorías
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingCategory ? 'Editar Categoría' : 'Añadir Categoría'}
                </h3>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    + Nueva
                  </button>
                )}
              </div>

              {showForm ? (
                <CategoryForm
                  category={editingCategory}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Haz clic en "+ Nueva" para agregar una categoría o en "Editar" en la tabla para modificar una existente.
                </p>
              )}
            </div>
          </div>

          {/* Tabla de categorías */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6">Categorías Existentes</h3>
              
              {loading ? (
                <Loading message="Cargando categorías..." />
              ) : (
                <CategoryTable
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryManagement;
