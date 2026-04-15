import { useState, useEffect } from "react";
import { appointmentService } from "../../services/api/appointmentService";
import { clientService } from "../../services/api/clientService";
import type { Client } from "../../services/api/clientService";
import { professionalService } from "../../services/api/professionalService";
import type { Professional } from "../../services/api/professionalService";
import { serviceService } from "../../services/api/serviceService";
import type { Service } from "../../services/api/serviceService";
import type { AxiosError } from "axios";

interface AppointmentData {
  clientId: number;
  professionalId: number;
  serviceId: number;
  date: string;
  notes?: string;
}

interface Appointment {
  id: number;
  clientId: number;
  professionalId: number;
  serviceId: number;
  date: string;
  status: string;
  notes: string | null;
  client?: { id: number; name: string };
  professional?: { id: number; name: string };
  service?: { id: number; name: string; duration: number; price: number };
}

const pad = (n: number): string => String(n).padStart(2, "0");
const fmt = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Horários das 08:00 às 20:00 (24 slots de 30 minutos)
const TIME_SLOTS: string[] = Array.from({ length: 24 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${pad(h)}:${m}`;
});

const WEEK_DAYS_PT: string[] = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MONTHS_PT: string[] = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS_FULL_PT: string[] = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

function getWeekDates(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - day + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const SLOT_HALF: number = 28;

const APPT_COLORS: string[] = [
  "bg-violet-500/20 border-violet-500/40 text-violet-300",
  "bg-teal-500/20 border-teal-500/40 text-teal-300",
  "bg-amber-500/20 border-amber-500/40 text-amber-300",
  "bg-rose-500/20 border-rose-500/40 text-rose-300",
  "bg-sky-500/20 border-sky-500/40 text-sky-300",
];


const STATUS_OPTIONS = [
  { value: "scheduled", label: "Agendado", color: "bg-amber-500/10 text-amber-400" },
  { value: "confirmed", label: "Confirmado", color: "bg-emerald-500/10 text-emerald-400" },
  { value: "completed", label: "Concluído", color: "bg-blue-500/10 text-blue-400" },
  { value: "cancelled", label: "Cancelado", color: "bg-red-500/10 text-red-400" },
];

interface NewAppointmentModalProps {
  onClose: () => void;
  onSave: (data: AppointmentData) => Promise<void>;
  initialDate?: string;
  initialTime?: string;
  clients: Client[];
  professionals: Professional[];
  services: Service[];
  loading?: boolean;
}

function NewAppointmentModal({ 
  onClose, 
  onSave, 
  initialDate, 
  initialTime, 
  clients, 
  professionals, 
  services,
  loading: parentLoading 
}: NewAppointmentModalProps) {
  const [clientId, setClientId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");
  const [date, setDate] = useState<string>(initialDate ?? fmt(new Date()));
  const [startTime, setStartTime] = useState<string>(initialTime ?? "09:00");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !serviceId || !professionalId) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const dateTime = new Date(`${date}T${startTime}:00`);
      await onSave({ 
        clientId: Number(clientId), 
        professionalId: Number(professionalId), 
        serviceId: Number(serviceId), 
        date: dateTime.toISOString(), 
        notes 
      });
      onClose();
    } catch (err: AxiosError | unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || "Erro ao agendar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Novo agendamento</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Cliente</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} required
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
              <option value="">Selecione um cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Serviço</label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
              <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} - {s.duration}min - R$ {s.price}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Profissional</label>
            <select value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} required
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
              <option value="">Selecione um profissional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Horário</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Observações</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm" />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={loading || parentLoading}
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-lg text-sm font-semibold">
              {loading ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Appointment>) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  clients: Client[];
  professionals: Professional[];
  services: Service[];
  loading?: boolean;
}

function EditAppointmentModal({ 
  appointment, 
  onClose, 
  onUpdate, 
  onCancel,
  clients, 
  professionals, 
  services,
  loading: parentLoading 
}: EditAppointmentModalProps) {
  const [clientId, setClientId] = useState<string>(String(appointment.clientId));
  const [serviceId, setServiceId] = useState<string>(String(appointment.serviceId));
  const [professionalId, setProfessionalId] = useState<string>(String(appointment.professionalId));
  const [date, setDate] = useState<string>(appointment.date.split("T")[0]);
  const [startTime, setStartTime] = useState<string>(new Date(appointment.date).toTimeString().slice(0, 5));
  const [status, setStatus] = useState<string>(appointment.status);
  const [notes, setNotes] = useState<string>(appointment.notes || "");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !serviceId || !professionalId) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const dateTime = new Date(`${date}T${startTime}:00`);
      await onUpdate(appointment.id, {
        clientId: Number(clientId),
        professionalId: Number(professionalId),
        serviceId: Number(serviceId),
        date: dateTime.toISOString(),
        status,
        notes,
      });
      onClose();
    } catch (err: AxiosError | unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || "Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      await onCancel(appointment.id);
      onClose();
    } catch (err: AxiosError | unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || "Erro ao cancelar");
      setLoading(false);
    }
  }

  const selectedService = services.find(s => s.id === Number(serviceId));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Editar agendamento</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {showCancelConfirm ? (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm text-center">
                Tem certeza que deseja cancelar este agendamento?
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)}
                className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium">
                Voltar
              </button>
              <button onClick={handleCancel} disabled={loading || parentLoading}
                className="flex-1 h-10 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-lg text-sm font-semibold">
                {loading ? "Cancelando..." : "Sim, cancelar"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Cliente</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
                <option value="">Selecione um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Serviço</label>
              <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
                <option value="">Selecione um serviço</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.duration}min - R$ {s.price}</option>
                ))}
              </select>
              {selectedService && (
                <p className="text-xs text-zinc-500 mt-1">
                  Duração: {selectedService.duration} minutos
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Profissional</label>
              <select value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} required
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
                <option value="">Selecione um profissional</option>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm text-zinc-400">Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                  className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm text-zinc-400">Horário</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required
                  className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm">
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Observações</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 text-sm" />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowCancelConfirm(true)}
                className="flex-1 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition">
                Cancelar agendamento
              </button>
              <button type="submit" disabled={loading || parentLoading}
                className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-lg text-sm font-semibold">
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [clickedDate, setClickedDate] = useState<string | undefined>();
  const [clickedTime, setClickedTime] = useState<string | undefined>();

  useEffect(() => {
    loadData();
  }, [currentDate]);

  async function loadData(): Promise<void> {
    setLoading(true);
    try {
      const weekDates = getWeekDates(currentDate);
      const startDate = fmt(weekDates[0]);
      const endDate = fmt(weekDates[6]);
      
      const [appts, clientsData, prosData, servsData] = await Promise.all([
        appointmentService.getAll({ startDate, endDate }),
        clientService.getAll(),
        professionalService.getAll(),
        serviceService.getAll(),
      ]);
      setAppointments(appts as Appointment[]);
      setClients(clientsData);
      setProfessionals(prosData);
      setServices(servsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const weekDates: Date[] = getWeekDates(currentDate);
  const todayStr: string = fmt(new Date());

  function prevWeek(): void {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }

  function nextWeek(): void {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  function goToday(): void { 
    setCurrentDate(new Date()); 
  }

  function handleCellClick(date: string, time: string): void {
    setClickedDate(date);
    setClickedTime(time);
    setShowNewModal(true);
  }

  function handleAppointmentClick(appointment: Appointment): void {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  }

  async function handleSave(apptData: AppointmentData): Promise<void> {
    await appointmentService.create(apptData);
    await loadData();
    setShowNewModal(false);
  }

  async function handleUpdate(id: number, data: Partial<Appointment>): Promise<void> {
    await appointmentService.update(id, data);
    await loadData();
    setShowEditModal(false);
    setSelectedAppointment(null);
  }

  async function handleCancel(id: number): Promise<void> {
    await appointmentService.update(id, { status: "cancelled" });
    await loadData();
    setShowEditModal(false);
    setSelectedAppointment(null);
  }

  const weekStart: Date = weekDates[0];
  const weekEnd: Date = weekDates[6];
  const weekLabel: string = weekStart.getMonth() === weekEnd.getMonth()
    ? `${weekStart.getDate()} — ${weekEnd.getDate()} ${MONTHS_FULL_PT[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`
    : `${weekStart.getDate()} ${MONTHS_PT[weekStart.getMonth()]} — ${weekEnd.getDate()} ${MONTHS_PT[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={goToday} className="px-3 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium">
            Hoje
          </button>
          <button onClick={nextWeek} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-zinc-300 text-sm font-medium hidden sm:inline">{weekLabel}</span>
        </div>
        <button onClick={() => { setClickedDate(todayStr); setClickedTime("09:00"); setShowNewModal(true); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo agendamento
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[640px]">
          <div className="grid border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
            <div className="border-r border-zinc-800" />
            {weekDates.map((d, i) => {
              const isToday = fmt(d) === todayStr;
              return (
                <div key={i} className="py-3 text-center border-r border-zinc-800 last:border-r-0">
                  <p className={`text-xs font-medium uppercase tracking-wider ${isToday ? "text-amber-500" : "text-zinc-500"}`}>
                    {WEEK_DAYS_PT[d.getDay()]}
                  </p>
                  <p className={`text-lg font-semibold mt-0.5 ${isToday ? "text-amber-500" : "text-zinc-300"}`}>
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative">
            {TIME_SLOTS.map((slot, si) => (
              <div key={slot} className="grid border-b border-zinc-800/50" style={{ gridTemplateColumns: "56px repeat(7, 1fr)", height: `${SLOT_HALF}px` }}>
                <div className="border-r border-zinc-800 flex items-start justify-end pr-2 pt-1 shrink-0">
                  {si % 2 === 0 && <span className="text-xs text-zinc-600">{slot}</span>}
                </div>
                {weekDates.map((d, di) => (
                  <div key={di}
                    onClick={() => handleCellClick(fmt(d), slot)}
                    className="border-r border-zinc-800/50 last:border-r-0 hover:bg-zinc-800/20 cursor-pointer transition relative"
                  />
                ))}
              </div>
            ))}

            {appointments.map((appt, idx) => {
              const apptDate = new Date(appt.date);
              const dateStr = fmt(apptDate);
              const colIndex = weekDates.findIndex((d) => fmt(d) === dateStr);
              if (colIndex === -1) return null;

              const timeStr = apptDate.toTimeString().slice(0, 5);
              const startMin = timeToMinutes(timeStr);
              const startFrom = timeToMinutes("08:00");
              const topPx = ((startMin - startFrom) / 30) * SLOT_HALF;
              const duration = appt.service?.duration || 30;
              const heightPx = Math.max((duration / 30) * SLOT_HALF - 2, 24);
              const colWidth = `calc((100% - 56px) / 7)`;
              const leftVal = `calc(56px + ${colIndex} * (100% - 56px) / 7 + 2px)`;
              const colorIndex = idx % APPT_COLORS.length;
              
              let statusColorClass = "";
              if (appt.status === "cancelled") statusColorClass = "bg-red-500/20 border-red-500/40 text-red-300 line-through";
              else if (appt.status === "completed") statusColorClass = "bg-blue-500/20 border-blue-500/40 text-blue-300";
              else if (appt.status === "confirmed") statusColorClass = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
              else statusColorClass = APPT_COLORS[colorIndex];

              return (
                <div key={appt.id}
                  onClick={() => handleAppointmentClick(appt)}
                  className={`absolute border rounded-lg px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-90 transition overflow-hidden ${statusColorClass}`}
                  style={{ top: topPx + 1, left: leftVal, width: `calc(${colWidth} - 4px)`, height: heightPx }}>
                  <p className="truncate font-semibold leading-tight">{appt.client?.name || 'Cliente'}</p>
                  {heightPx > 32 && (
                    <p className="truncate opacity-80 leading-tight">{appt.service?.name}</p>
                  )}
                  {heightPx > 48 && appt.status === "cancelled" && (
                    <p className="truncate text-[10px] opacity-70">Cancelado</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewAppointmentModal
          onClose={() => setShowNewModal(false)}
          onSave={handleSave}
          initialDate={clickedDate}
          initialTime={clickedTime}
          clients={clients}
          professionals={professionals}
          services={services}
          loading={loading}
        />
      )}

      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => { setShowEditModal(false); setSelectedAppointment(null); }}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          clients={clients}
          professionals={professionals}
          services={services}
          loading={loading}
        />
      )}
    </div>
  );
}
