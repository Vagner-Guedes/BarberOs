import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/api/dashboardService";
import type { DashboardStats, RecentAppointment } from "../../services/api/dashboardService";

interface RecentClient {
  id: number;
  name: string;
  date: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getInitialsColor(initials: string): string {
  const colors = [
    "bg-amber-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-teal-500",
    "bg-sky-500",
    "bg-orange-500",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

function statusStyle(status: string): string {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "confirmed":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    default:
      return "bg-zinc-700 text-zinc-400";
  }
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendado",
  confirmed: "Confirmado",
  completed: "Concluido",
  cancelled: "Cancelado",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<RecentAppointment[]>([]);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData(): Promise<void> {
    setLoading(true);
    try {
      const [statsData, recentData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAppointments(10),
      ]);
      setStats(statsData);

      const today = new Date().toDateString();
      const todayApps = recentData.filter((appt: RecentAppointment) =>
        new Date(appt.date).toDateString() === today
      );
      setTodayAppointments(todayApps);

      const uniqueClients = new Map<number, RecentClient>();
      recentData.forEach((appt: RecentAppointment) => {
        if (!uniqueClients.has(appt.client.id)) {
          uniqueClients.set(appt.client.id, {
            id: appt.client.id,
            name: appt.client.name,
            date: new Date(appt.date).toLocaleDateString("pt-BR"),
          });
        }
      });
      setRecentClients(Array.from(uniqueClients.values()).slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Agendamentos hoje",
      value: stats?.appointments.today || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Clientes cadastrados",
      value: stats?.clients.total || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Profissionais ativos",
      value: stats?.professionals.active || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: "Servicos disponiveis",
      value: stats?.services.active || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243zm7.364-9.243a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      <div>
        <h1 className="text-2xl font-semibold text-white">
          {getGreeting()}, Vagner!
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5 capitalize">
          {getFormattedDate()}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <span className="text-zinc-600">{stat.icon}</span>
            </div>
            <p className="text-3xl font-semibold text-white mt-3">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold text-white text-sm">Agenda de hoje</h2>
            <button
              onClick={() => navigate("/appointments")}
              className="text-sm text-amber-500 hover:text-amber-400 transition font-medium"
            >
              Ver todos
            </button>
          </div>

          <div className="divide-y divide-zinc-800/50">
            {todayAppointments.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-zinc-500 text-sm">Nenhum agendamento para hoje</p>
              </div>
            ) : (
              todayAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center gap-4 px-5 py-4">
                  <div className={`w-9 h-9 ${getInitialsColor(getInitials(appt.client.name))} rounded-full flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-semibold">{getInitials(appt.client.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{appt.client.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {appt.service.name} • {appt.professional.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-zinc-300">{formatTime(appt.date)}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle(appt.status)}`}>
                      {STATUS_LABELS[appt.status] || appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex-1">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white text-sm">Clientes recentes</h2>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {recentClients.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-zinc-500 text-xs">Nenhum cliente recente</p>
                </div>
              ) : (
                recentClients.map((client) => (
                  <div key={client.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className={`w-9 h-9 ${getInitialsColor(getInitials(client.name))} rounded-full flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-semibold">{getInitials(client.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{client.name}</p>
                      <p className="text-xs text-zinc-500">{client.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/appointments")}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo agendamento
          </button>

        </div>
      </div>
    </div>
  );
}
