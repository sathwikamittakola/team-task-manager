import api from './api';

export const taskService = {
  getAll: async (projectId = null) => {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    const response = await api.get(url);
    return response.data;
  },
  
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  }
};
