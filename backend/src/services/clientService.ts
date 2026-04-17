import { prisma } from '../config/database';

export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const clientService = {
  async findAll(): Promise<Client[]> {
    return await prisma.client.findMany();
  },

  async findById(id: number): Promise<Client | null> {
    return await prisma.client.findUnique({ where: { id } });
  },

  async create(data: { name: string; email?: string; phone: string }): Promise<Client> {
    return await prisma.client.create({ data });
  },

  async update(id: number, data: { name?: string; email?: string; phone?: string; active?: boolean }): Promise<Client> {
    return await prisma.client.update({ where: { id }, data });
  },

  async delete(id: number): Promise<void> {
    const appointmentsCount = await prisma.appointment.count({
      where: { clientId: id }
    });
    if (appointmentsCount > 0) {
      throw new Error('Não é possível excluir um cliente que possui agendamentos. Desative-o em vez de excluir.');
    }
    await prisma.client.delete({ where: { id } });
  },
};
