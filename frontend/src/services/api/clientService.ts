import api from './api';

export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await api.get('/clients');
    return response.data;
  },

  async getById(id: number): Promise<Client> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async create(data: { name: string; email?: string; phone: string }): Promise<Client> {
    const response = await api.post('/clients', data);
    return response.data;
  },

  async update(id: number, data: Partial<Client>): Promise<Client> {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
