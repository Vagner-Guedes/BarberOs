import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  },

  async getRecentAppointments(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const appointments = await dashboardService.getRecentAppointments(limit);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos recentes' });
    }
  },

  async getAppointmentsByStatus(req: Request, res: Response) {
    try {
      const data = await dashboardService.getAppointmentsByStatus();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos por status' });
    }
  },

  async getAppointmentsByDay(req: Request, res: Response) {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const data = await dashboardService.getAppointmentsByDay(days);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos por dia' });
    }
  },
};
