import { prisma } from '../config/database';

export const professionalService = {
  async findAll() {
    return await prisma.professional.findMany();
  },

  async findById(id: number) {
    return await prisma.professional.findUnique({ where: { id } });
  },

  async create(data: { name: string; email?: string; phone: string; role: string; specialties: string[] }) {
    return await prisma.professional.create({ data });
  },

  async update(id: number, data: { name?: string; email?: string; phone?: string; role?: string; specialties?: string[]; active?: boolean }) {
    return await prisma.professional.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prisma.professional.delete({ where: { id } });
  },
};
