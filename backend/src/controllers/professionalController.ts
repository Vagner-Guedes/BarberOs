import { Request, Response } from 'express';
import { professionalService } from '../services/professionalService';

export const professionalController = {
  async list(req: Request, res: Response) {
    const professionals = await professionalService.findAll();
    res.json(professionals);
  },

  async getById(req: Request, res: Response) {
    const professional = await professionalService.findById(Number(req.params.id));
    if (!professional) return res.status(404).json({ error: 'Profissional não encontrado' });
    res.json(professional);
  },

  async create(req: Request, res: Response) {
    const professional = await professionalService.create(req.body);
    res.status(201).json(professional);
  },

  async update(req: Request, res: Response) {
    const professional = await professionalService.update(Number(req.params.id), req.body);
    res.json(professional);
  },

  async delete(req: Request, res: Response) {
    await professionalService.delete(Number(req.params.id));
    res.status(204).send();
  },
};
