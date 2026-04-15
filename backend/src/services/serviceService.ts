import { prisma } from '../config/database';

export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const serviceService = {
  async findAll(): Promise<Service[]> {
    return await prisma.service.findMany();
  },

  async findById(id: number): Promise<Service | null> {
    return await prisma.service.findUnique({ where: { id } });
  },

  async create(data: { name: string; description?: string; duration: number; price: number }): Promise<Service> {
    return await prisma.service.create({ data });
  },

  async update(id: number, data: { name?: string; description?: string; duration?: number; price?: number; active?: boolean }): Promise<Service> {
    return await prisma.service.update({ where: { id }, data });
  },

  async delete(id: number): Promise<void> {
    await prisma.service.delete({ where: { id } });
  },
};
