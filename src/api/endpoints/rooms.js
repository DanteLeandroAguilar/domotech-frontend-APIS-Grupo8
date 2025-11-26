import api from '../clients';

export const roomsAPI = {
  // GET /rooms - Obtener habitaciones del usuario autenticado
  getUserRooms: async () => {
    const response = await api.get('/rooms');
    return response;
  },

  // POST /rooms - Crear nueva habitación
  createRoom: async (name) => {
    const response = await api.post('/rooms', { name });
    return response;
  },

  // PUT /rooms/{roomId} - Actualizar habitación
  updateRoom: async (roomId, name) => {
    const response = await api.put(`/rooms/${roomId}`, { name });
    return response;
  },

  // DELETE /rooms/{roomId} - Eliminar habitación
  deleteRoom: async (roomId) => {
    await api.delete(`/rooms/${roomId}`);
  },
};

