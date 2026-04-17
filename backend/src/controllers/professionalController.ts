import { Request, Response } from 'express';
import { professionalService } from '../services/professionalService';

export const professionalController = {
  async list(req: Request, res: Response) {
    const professionals = await professionalService.findAll();
    res.json(professionals);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const professional = await professionalService.findById(Number(id));
    if (!professional) return res.status(404).json({ error: 'Profissional não encontrado' });
    res.json(professional);
  },

  async create(req: Request, res: Response) {
    const { name, email, phone, role, specialties } = req.body;
    const professional = await professionalService.create({ name, email, phone, role, specialties });
    res.status(201).json(professional);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone, role, specialties, active } = req.body;
    const professional = await professionalService.update(Number(id), { name, email, phone, role, specialties, active });
    res.json(professional);
  },

  async delete(req: Request, res: Response) {
    try {
      await professionalService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('agendamentos')) {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar profissional' });
    }
  },
};
