import api from './api';

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  }
};
