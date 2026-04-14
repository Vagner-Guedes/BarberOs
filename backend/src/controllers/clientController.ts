import { Request, Response } from 'express';
import { clientService } from '../services/clientService';

export const clientController = {
  async list(req: Request, res: Response) {
    const clients = await clientService.findAll();
    res.json(clients);
  },

  async getById(req: Request, res: Response) {
    const client = await clientService.findById(Number(req.params.id));
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  },

  async create(req: Request, res: Response) {
    const client = await clientService.create(req.body);
    res.status(201).json(client);
  },

  async update(req: Request, res: Response) {
    const client = await clientService.update(Number(req.params.id), req.body);
    res.json(client);
  },

  async delete(req: Request, res: Response) {
    await clientService.delete(Number(req.params.id));
    res.status(204).send();
  },
};
