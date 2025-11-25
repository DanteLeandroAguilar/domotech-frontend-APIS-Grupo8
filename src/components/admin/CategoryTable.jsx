export const CategoryTable = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay categorías registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Descripción</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.categoryId}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-6 py-4 font-medium">{category.categoryId}</td>
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                {category.name}
              </th>
              <td className="px-6 py-4">
                <div className="max-w-md truncate" title={category.description}>
                  {category.description}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => onEdit(category)}
                    className="font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(category.categoryId)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
