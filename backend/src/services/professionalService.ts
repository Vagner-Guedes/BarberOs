import { prisma } from '../config/database';

export interface Professional {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  specialties: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const professionalService = {
  async findAll(): Promise<Professional[]> {
    return await prisma.professional.findMany();
  },

  async findById(id: number): Promise<Professional | null> {
    return await prisma.professional.findUnique({ where: { id } });
  },

  async create(data: { name: string; email?: string; phone: string; role: string; specialties: string[] }): Promise<Professional> {
    return await prisma.professional.create({ data });
  },

  async update(id: number, data: { name?: string; email?: string; phone?: string; role?: string; specialties?: string[]; active?: boolean }): Promise<Professional> {
    return await prisma.professional.update({ where: { id }, data });
  },

  async delete(id: number): Promise<void> {
    const appointmentsCount = await prisma.appointment.count({
      where: { professionalId: id }
    });
    if (appointmentsCount > 0) {
      throw new Error('Não é possível excluir um profissional que possui agendamentos. Desative-o em vez de excluir.');
    }
    await prisma.professional.delete({ where: { id } });
  },
};
