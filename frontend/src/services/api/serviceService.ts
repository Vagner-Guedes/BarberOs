import api from './api';

export interface Service {
  id: number;
  name: string;
  description?: string | null;  // tornando opcional
  duration: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const response = await api.get('/services');
    return response.data;
  },

  async getById(id: number): Promise<Service> {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async create(data: { name: string; description?: string; duration: number; price: number }): Promise<Service> {
    const response = await api.post('/services', data);
    return response.data;
  },

  async update(id: number, data: Partial<Service>): Promise<Service> {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/services/${id}`);
  },
};
