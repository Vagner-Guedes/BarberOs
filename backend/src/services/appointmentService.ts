import { prisma } from '../config/database';

export interface Appointment {
  id: number;
  clientId: number;
  professionalId: number;
  serviceId: number;
  date: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const appointmentService = {
  async findAll(): Promise<any[]> {
    return await prisma.appointment.findMany({
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async findById(id: number): Promise<any | null> {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async findByDate(date: Date): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    return await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async create(data: {
    clientId: number;
    professionalId: number;
    serviceId: number;
    date: Date;
    status?: string;
    notes?: string;
  }): Promise<any> {
    return await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        date: data.date,
        status: data.status || 'scheduled',
        notes: data.notes || null,
      },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async update(id: number, data: {
    clientId?: number;
    professionalId?: number;
    serviceId?: number;
    date?: Date;
    status?: string;
    notes?: string;
  }): Promise<any> {
    return await prisma.appointment.update({
      where: { id },
      data,
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  },

  async checkAvailability(professionalId: number, date: Date, duration: number): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        professionalId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        service: true,
      },
    });

    const appointmentTime = date.getTime();
    const appointmentEnd = appointmentTime + duration * 60000;

    for (const appt of appointments) {
      const existingStart = appt.date.getTime();
      const existingDuration = appt.service?.duration || 30;
      const existingEnd = existingStart + existingDuration * 60000;
      
      if (appointmentTime < existingEnd && appointmentEnd > existingStart) {
        return false;
      }
    }
    return true;
  },
};
