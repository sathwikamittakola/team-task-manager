import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  }
};
