import api from './api';

export interface Appointment {
  id: number;
  clientId: number;
  professionalId: number;
  serviceId: number;
  date: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: number;
    name: string;
  };
  professional?: {
    id: number;
    name: string;
  };
  service?: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

export const appointmentService = {
  async getAll(params?: { startDate?: string; endDate?: string; date?: string }): Promise<Appointment[]> {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  async getById(id: number): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async create(data: {
    clientId: number;
    professionalId: number;
    serviceId: number;
    date: string;
    notes?: string;
  }): Promise<Appointment> {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  async checkAvailability(professionalId: number, date: string, duration: number): Promise<boolean> {
    const response = await api.get('/appointments/check-availability', {
      params: { professionalId, date, duration },
    });
    return response.data.available;
  },
};
