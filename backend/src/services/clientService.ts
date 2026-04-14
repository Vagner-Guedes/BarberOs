import { prisma } from '../config/database';

export const clientService = {
  async findAll() {
    return await prisma.client.findMany();
  },

  async findById(id: number) {
    return await prisma.client.findUnique({ where: { id } });
  },

  async create(data: { name: string; email?: string; phone: string }) {
    return await prisma.client.create({ data });
  },

  async update(id: number, data: { name?: string; email?: string; phone?: string; active?: boolean }) {
    return await prisma.client.update({ where: { id }, data });
  },

  async delete(id: number) {
    return await prisma.client.delete({ where: { id } });
  },
};
