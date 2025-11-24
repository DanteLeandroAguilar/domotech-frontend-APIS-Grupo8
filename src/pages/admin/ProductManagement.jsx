import { useState, useEffect } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductTable } from '../../components/admin/ProductTable';
import { Loading } from '../../components/common/Loading';
import { productsAPI } from '../../api/endpoints/products';
import { imagesAPI } from '../../api/endpoints/images';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll(0, 100);
      // Las imágenes ya vienen en la respuesta del producto
      setProducts(data.content || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const { images, ...productData } = formData;
      let productId;

      if (editingProduct) {
        // Actualizar producto existente
        await productsAPI.update(editingProduct.productId, productData);
        productId = editingProduct.productId;
        
        // Actualizar stock si cambió
        const stockChanged = Number(productData.stock) !== Number(editingProduct.stock);
        if (stockChanged) {
          await productsAPI.updateStock(editingProduct.productId, { stock: Number(productData.stock) });
        }
      } else {
        // Crear nuevo producto
        const response = await productsAPI.create(productData);
        productId = response.productId;
      }

      // Procesar imágenes
      if (images && images.length > 0) {
        // 1. Eliminar imágenes que ya no están (solo para edición)
        if (editingProduct && editingProduct.images) {
          const currentImageIds = images
            .filter(img => !img.isNew)
            .map(img => img.imageId || img.id);
          
          const imagesToDelete = editingProduct.images.filter(
            img => !currentImageIds.includes(img.imageId)
          );

          for (const img of imagesToDelete) {
            try {
              await imagesAPI.delete(img.imageId);
            } catch (error) {
              console.error('Error al eliminar imagen:', error);
            }
          }
        }

        // 2. Subir imágenes nuevas
        const newImages = images.filter(img => img.isNew);
        const uploadedImages = [];

        for (const img of newImages) {
          try {
            const formDataImage = new FormData();
            formDataImage.append('file', img.file);
            const response = await imagesAPI.upload(productId, formDataImage);
            uploadedImages.push(response);
          } catch (error) {
            console.error('Error al subir imagen:', error);
            toast.error('Error al subir una o más imágenes');
          }
        }

        // 3. Establecer imagen principal
        const mainImage = images.find(img => img.isMain);
        if (mainImage) {
          try {
            let mainImageId = mainImage.imageId || mainImage.id;
            
            if (mainImage.isNew) {
              // Encontrar el ID de la imagen subida correspondiente
              const uploadedIndex = newImages.findIndex(img => img.id === mainImage.id);
              if (uploadedIndex !== -1 && uploadedImages[uploadedIndex]) {
                mainImageId = uploadedImages[uploadedIndex].imageId || uploadedImages[uploadedIndex].id;
              }
            }
            
            if (mainImageId && !mainImageId.toString().startsWith('new-')) {
              await imagesAPI.markAsPrincipal(mainImageId);
            }
          } catch (error) {
            console.error('Error al marcar imagen principal:', error);
          }
        }
      }

      toast.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error(error.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      toast.success('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar producto');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Gestionar Productos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingProduct ? 'Editar Producto' : 'Añadir Producto'}
                </h3>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    + Nuevo
                  </button>
                )}
              </div>

              {showForm ? (
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Haz clic en "+ Nuevo" para agregar un producto o en "Editar" en la tabla para modificar uno existente.
                </p>
              )}
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-6">Productos Existentes</h3>
              
              {loading ? (
                <Loading message="Cargando productos..." />
              ) : (
                <ProductTable
                  products={products}
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

export default ProductManagement;