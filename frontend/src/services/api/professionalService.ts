import api from './api';

export interface Professional {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  specialties: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const professionalService = {
  async getAll(): Promise<Professional[]> {
    const response = await api.get('/professionals');
    return response.data;
  },

  async getById(id: number): Promise<Professional> {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  },

  async create(data: { name: string; email?: string; phone: string; role: string; specialties: string[] }): Promise<Professional> {
    const response = await api.post('/professionals', data);
    return response.data;
  },

  async update(id: number, data: Partial<Professional>): Promise<Professional> {
    const response = await api.put(`/professionals/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/professionals/${id}`);
  },
};
