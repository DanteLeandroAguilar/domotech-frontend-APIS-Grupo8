import { useState, useEffect, useRef } from 'react';
import { roomsAPI } from '../../api/endpoints/rooms';
import { useSelector } from 'react-redux';

export const RoomSelector = ({ value, onChange, className = '', onRoomsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [rooms, setRooms] = useState(['general']);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Cargar habitaciones desde la API al montar
  useEffect(() => {
    if (isAuthenticated) {
      loadRooms();
    } else {
      // Si no está autenticado, solo usar "general"
      setRooms(['general']);
    }
  }, [isAuthenticated]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await roomsAPI.getUserRooms();
      const roomNames = ['general', ...roomsData.map(room => room.name)];
      setRooms(roomNames);
      if (onRoomsChange) {
        onRoomsChange(roomNames);
      }
    } catch (error) {
      console.error('Error al cargar habitaciones:', error);
      // En caso de error, usar solo "general"
      setRooms(['general']);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsCreatingNew(false);
        setInputValue('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectRoom = (room) => {
    onChange(room);
    setIsOpen(false);
    setIsCreatingNew(false);
    setInputValue('');
  };

  const handleCreateNew = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsCreatingNew(true);
    setInputValue('');
  };

  const handleSaveNewRoom = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && trimmedValue.length <= 50) {
      try {
        setLoading(true);
        await roomsAPI.createRoom(trimmedValue);
        // Recargar habitaciones desde la API
        await loadRooms();
        const newRoom = trimmedValue.toLowerCase();
        handleSelectRoom(newRoom);
      } catch (error) {
        console.error('Error al crear habitación:', error);
        alert(error.message || 'Error al crear la habitación');
      } finally {
        setLoading(false);
        setIsCreatingNew(false);
        setInputValue('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveNewRoom();
    } else if (e.key === 'Escape') {
      setIsCreatingNew(false);
      setInputValue('');
      setIsOpen(false);
    }
  };

  const displayValue = value || 'general';
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a === 'general') return -1;
    if (b === 'general') return 1;
    return a.localeCompare(b);
  });

  const handleButtonClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    // Recargar habitaciones cuando se abre el dropdown para tener las más actualizadas
    if (willOpen && isAuthenticated) {
      await loadRooms();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between disabled:opacity-50"
      >
        <span className="truncate">
          {loading ? 'Cargando...' : displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}
        </span>
        <span className="material-symbols-outlined text-sm ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute' }}
        >
          {!isCreatingNew ? (
            <>
              {sortedRooms.map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectRoom(room);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    displayValue === room ? 'bg-primary/10 text-primary' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {room.charAt(0).toUpperCase() + room.slice(1)}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-600 border-t border-gray-200 dark:border-gray-600"
              >
                <span className="material-symbols-outlined text-sm align-middle mr-2">add</span>
                Crear nueva habitación
              </button>
            </>
          ) : (
            <div className="p-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nombre de la habitación"
                maxLength={50}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleSaveNewRoom}
                  className="flex-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setInputValue('');
                  }}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

