import { prisma } from '../config/database';

export const dashboardService = {
  async getStats() {
    const [
      totalClients,
      activeClients,
      totalProfessionals,
      activeProfessionals,
      totalServices,
      activeServices,
      totalAppointments,
      todayAppointments,
      weekAppointments,
      monthAppointments,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { active: true } }),
      prisma.professional.count(),
      prisma.professional.count({ where: { active: true } }),
      prisma.service.count(),
      prisma.service.count({ where: { active: true } }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)),
          },
        },
      }),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
      }),
    ]);

    return {
      clients: { total: totalClients, active: activeClients, inactive: totalClients - activeClients },
      professionals: { total: totalProfessionals, active: activeProfessionals, inactive: totalProfessionals - activeProfessionals },
      services: { total: totalServices, active: activeServices, inactive: totalServices - activeServices },
      appointments: { total: totalAppointments, today: todayAppointments, week: weekAppointments, month: monthAppointments },
    };
  },

  async getRecentAppointments(limit: number = 10) {
    return await prisma.appointment.findMany({
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  },

  async getAppointmentsByStatus() {
    const appointments = await prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    });
    return appointments.map((item) => ({
      status: item.status,
      count: item._count,
    }));
  },

  async getAppointmentsByDay(days: number = 7) {
    const dates: Date[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    const results = await Promise.all(
      dates.map(async (date) => {
        const count = await prisma.appointment.count({
          where: {
            date: {
              gte: date,
              lte: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });
        return {
          date: date.toLocaleDateString('pt-BR'),
          appointments: count,
        };
      })
    );

    return results;
  },

  async getRevenueByPeriod(startDate: Date, endDate: Date) {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: { in: ['completed', 'confirmed'] },
      },
      include: {
        service: true,
      },
    });

    const total = appointments.reduce((sum, appt) => sum + (appt.service?.price || 0), 0);
    return { total, count: appointments.length };
  },
};
