import api from './api';

export interface DashboardStats {
  clients: { total: number; active: number; inactive: number };
  professionals: { total: number; active: number; inactive: number };
  services: { total: number; active: number; inactive: number };
  appointments: { total: number; today: number; week: number; month: number };
}

export interface RecentAppointment {
  id: number;
  date: string;
  status: string;
  client: { 
    id: number;
    name: string;
    email: string | null;
    phone: string;
  };
  professional: { 
    id: number;
    name: string;
    role: string;
  };
  service: { 
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface DailyAppointment {
  date: string;
  appointments: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getRecentAppointments(limit: number = 10): Promise<RecentAppointment[]> {
    const response = await api.get('/dashboard/recent-appointments', { params: { limit } });
    return response.data;
  },

  async getAppointmentsByStatus(): Promise<StatusCount[]> {
    const response = await api.get('/dashboard/appointments-by-status');
    return response.data;
  },

  async getAppointmentsByDay(days: number = 7): Promise<DailyAppointment[]> {
    const response = await api.get('/dashboard/appointments-by-day', { params: { days } });
    return response.data;
  },
};
