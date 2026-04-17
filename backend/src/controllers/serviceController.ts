import { Request, Response } from 'express';
import { serviceService } from '../services/serviceService';

export const serviceController = {
  async list(req: Request, res: Response) {
    const services = await serviceService.findAll();
    res.json(services);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const service = await serviceService.findById(Number(id));
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(service);
  },

  async create(req: Request, res: Response) {
    const { name, description, duration, price } = req.body;
    const service = await serviceService.create({ name, description, duration, price });
    res.status(201).json(service);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, duration, price, active } = req.body;
    const service = await serviceService.update(Number(id), { name, description, duration, price, active });
    res.json(service);
  },

  async delete(req: Request, res: Response) {
    try {
      await serviceService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('agendamentos')) {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
  },
};
