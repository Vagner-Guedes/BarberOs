import { Request, Response } from 'express';
import { clientService } from '../services/clientService';

export const clientController = {
  async list(req: Request, res: Response) {
    const clients = await clientService.findAll();
    res.json(clients);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const client = await clientService.findById(Number(id));
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  },

  async create(req: Request, res: Response) {
    const { name, email, phone } = req.body;
    const client = await clientService.create({ name, email, phone });
    res.status(201).json(client);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone, active } = req.body;
    const client = await clientService.update(Number(id), { name, email, phone, active });
    res.json(client);
  },

  async delete(req: Request, res: Response) {
    try {
      await clientService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('agendamentos')) {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  },
};
