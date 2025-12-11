import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { ProductForm } from '../../components/admin/ProductForm';
import { ProductTable } from '../../components/admin/ProductTable';
import { Loading } from '../../components/common/Loading';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, updateProductInList } from '../../store/slices/productsSlice';
import { imagesAPI } from '../../api/endpoints/images';
import { toast } from 'react-toastify';

// se crea el componente
const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // El useEffect se ejecuta cada vez que pase algo con el dispatch (es estatico, solo se ejecuta la primera vez)
  useEffect(() => {
    dispatch(fetchAllProducts({ page: 0, size: 100 })); // obtiene los datos del backend y los guarda en el store
  }, [dispatch]); // El array de dependencias incluye dispatch

  // Maneja el envío del formulario para crear o actualizar un producto
  const handleSubmit = async (formData) => {
    try {
      const { images, ...productData } = formData; // desempaqueta el producto en imagenes y datos del producto
      let productId;

      if (editingProduct) {
        // Convertir stock a número antes de actualizar
        const productDataWithNumberStock = {
          ...productData,
          stock: Number(productData.stock)
        };
        
        // Actualizar producto existente (incluye stock)
        const updateResult = await dispatch(updateProduct({ 
          id: editingProduct.productId, 
          productData: productDataWithNumberStock
        }));
        
        if (updateProduct.rejected.match(updateResult)) {
          toast.error(updateResult.payload?.message || 'Error al actualizar el producto');
          return;
        }
        
        productId = editingProduct.productId;
      } else {
        // Crear nuevo producto
        const createResult = await dispatch(createProduct(productData));
        
        if (createProduct.rejected.match(createResult)) {
          toast.error(createResult.payload?.message || 'Error al crear el producto');
          return;
        }
        
        productId = createResult.payload.productId;
      }

      // Procesar imágenes
      let updatedProduct = null;
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
              const response = await imagesAPI.delete(img.imageId);
              // El backend retorna el producto actualizado
              if (response && response.productId) {
                updatedProduct = response;
                dispatch(updateProductInList(response));
              }
            } catch (error) {
              console.error('Error al eliminar imagen:', error);
            }
          }
        }

        // 2. Subir imágenes nuevas
        const newImages = images.filter(img => img.isNew);
        let productAfterUpload = null;
        const existingImageIds = editingProduct?.images?.map(img => img.imageId) || [];

        for (const img of newImages) {
          try {
            const formDataImage = new FormData();
            formDataImage.append('file', img.file);
            const response = await imagesAPI.upload(productId, formDataImage);
            // El backend retorna el producto actualizado
            if (response && response.productId) {
              productAfterUpload = response;
              updatedProduct = response;
              dispatch(updateProductInList(response));
            }
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
            
            if (mainImage.isNew && productAfterUpload) {
              // Si la imagen principal es nueva, buscar su imageId en el producto retornado
              const productImages = productAfterUpload.images || [];
              if (productImages.length > 0) {
                // Obtener todas las imágenes nuevas del producto (que no estaban antes)
                const newImagesInProduct = productImages.filter(
                  img => !existingImageIds.includes(img.imageId)
                );
                
                if (newImagesInProduct.length > 0) {
                  // Si hay múltiples imágenes nuevas, usar el índice de la imagen principal
                  // en el array de imágenes nuevas para encontrar su correspondiente
                  const mainImageIndex = newImages.findIndex(img => img.id === mainImage.id);
                  if (mainImageIndex !== -1 && newImagesInProduct[mainImageIndex]) {
                    mainImageId = newImagesInProduct[mainImageIndex].imageId;
                  } else {
                    // Fallback: usar la primera imagen nueva si no se puede identificar
                    mainImageId = newImagesInProduct[0]?.imageId;
                  }
                }
              }
            }
            
            if (mainImageId && !mainImageId.toString().startsWith('new-')) {
              const response = await imagesAPI.markAsPrincipal(mainImageId);
              // El backend retorna el producto actualizado
              if (response && response.productId) {
                updatedProduct = response;
                dispatch(updateProductInList(response));
              }
            }
          } catch (error) {
            console.error('Error al marcar imagen principal:', error);
          }
        }
      }

      toast.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      setShowForm(false); 
      setEditingProduct(null); 

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
    const result = await dispatch(deleteProduct(productId));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Producto eliminado correctamente');
      // No es necesario recargar, el slice ya actualiza el estado
    } else if (deleteProduct.rejected.match(result)) {
      toast.error(result.error?.message || 'Error al eliminar producto');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-0 sm:px-4 lg:px-0 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Gestionar Productos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
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