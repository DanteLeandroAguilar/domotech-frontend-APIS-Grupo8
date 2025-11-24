import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { CategoryTable } from '../../components/admin/CategoryTable';
import { Loading } from '../../components/common/Loading';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../store/categoriesSlice';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { items: categories, status: loading } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (loading === 'idle' || !categories) dispatch(fetchCategories());
  }, [dispatch, loading, categories]);

  const handleSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.categoryId, categoryData: formData })).unwrap();
        toast.success('Categoría actualizada correctamente');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Categoría creada correctamente');
      }

      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      toast.error(error?.message || 'Error al guardar categoría');
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
      await dispatch(deleteCategory(categoryId)).unwrap();
      toast.success('Categoría eliminada correctamente');
    } catch (error) {
      toast.error(error?.message || 'Error al eliminar categoría');
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
