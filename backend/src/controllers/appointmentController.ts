import { Request, Response } from 'express';
import { appointmentService } from '../services/appointmentService';
import { serviceService } from '../services/serviceService';

export const appointmentController = {
  async list(req: Request, res: Response) {
    const { startDate, endDate, date } = req.query;
    
    try {
      let appointments;
      if (date) {
        appointments = await appointmentService.findByDate(new Date(date as string));
      } else if (startDate && endDate) {
        appointments = await appointmentService.findByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        appointments = await appointmentService.findAll();
      }
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const appointment = await appointmentService.findById(Number(id));
    if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(appointment);
  },

  async create(req: Request, res: Response) {
    const { clientId, professionalId, serviceId, date, notes } = req.body;
    
    try {
      const service = await serviceService.findById(serviceId);
      if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });

      const isAvailable = await appointmentService.checkAvailability(
        professionalId,
        new Date(date),
        service.duration
      );

      if (!isAvailable) {
        return res.status(409).json({ error: 'Horário não disponível' });
      }

      const appointment = await appointmentService.create({
        clientId,
        professionalId,
        serviceId,
        date: new Date(date),
        notes,
      });
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { clientId, professionalId, serviceId, date, status, notes } = req.body;
    
    try {
      const appointment = await appointmentService.update(Number(id), {
        clientId,
        professionalId,
        serviceId,
        date: date ? new Date(date) : undefined,
        status,
        notes,
      });
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await appointmentService.delete(Number(id));
    res.status(204).send();
  },

  async checkAvailability(req: Request, res: Response) {
    const { professionalId, date, duration } = req.query;
    
    const isAvailable = await appointmentService.checkAvailability(
      Number(professionalId),
      new Date(date as string),
      Number(duration)
    );
    
    res.json({ available: isAvailable });
  },
};
