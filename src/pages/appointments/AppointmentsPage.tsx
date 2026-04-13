import { useState } from "react";

interface Appointment {
  id: number;
  client: string;
  service: string;
  professional: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  duration: number; // minutos
  color: string;
}

const today = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const mockAppointments: Appointment[] = [
  { id: 1,  client: "Lucas Oliveira",   service: "Corte Masculino",  professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1)), startTime: "09:00", duration: 30, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { id: 2,  client: "Marcos Santos",    service: "Corte + Barba",    professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1)), startTime: "10:00", duration: 50, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { id: 3,  client: "Pedro Henrique",   service: "Barba",            professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1)), startTime: "11:00", duration: 20, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { id: 4,  client: "Rafael Costa",     service: "Corte Masculino",  professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1)), startTime: "14:00", duration: 30, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { id: 5,  client: "Bruno Almeida",    service: "Pigmentação",      professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1)), startTime: "15:30", duration: 60, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { id: 6,  client: "Felipe Rodrigues", service: "Corte + Barba",    professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2)), startTime: "09:30", duration: 50, color: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
  { id: 7,  client: "Gabriel Lima",     service: "Hidratação Capilar",professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2)), startTime: "14:00", duration: 40, color: "bg-teal-500/20 border-teal-500/40 text-teal-300" },
  { id: 8,  client: "Marcos Santos",    service: "Corte Masculino",  professional: "Diego Barbeiro", date: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3)), startTime: "10:00", duration: 30, color: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
];

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${pad(h)}:${m}`;
});

const WEEK_DAYS_PT = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS_FULL_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

function getWeekDates(referenceDate: Date) {
  const day = referenceDate.getDay();
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - day + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const SLOT_HEIGHT = 56; // px por hora
const SLOT_HALF = SLOT_HEIGHT / 2;

interface NewAppointmentModal {
  onClose: () => void;
  onSave: (appt: Omit<Appointment, "id" | "color">) => void;
  initialDate?: string;
  initialTime?: string;
}

function NewAppointmentModal({ onClose, onSave, initialDate, initialTime }: NewAppointmentModal) {
  const [client,       setClient]       = useState("");
  const [service,      setService]      = useState("");
  const [professional, setProfessional] = useState("Diego Barbeiro");
  const [date,         setDate]         = useState(initialDate ?? fmt(new Date()));
  const [startTime,    setStartTime]    = useState(initialTime ?? "09:00");
  const [duration,     setDuration]     = useState(30);
  const [error,        setError]        = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client.trim() || !service.trim() || !date || !startTime) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    onSave({ client, service, professional, date, startTime, duration });
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
            <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nome do cliente"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Serviço</label>
            <select value={service} onChange={(e) => setService(e.target.value)}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition">
              <option value="">Selecione um serviço</option>
              {["Corte Masculino","Barba","Corte + Barba","Corte Degradê","Hidratação Capilar","Coloração","Pigmentação"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Profissional</label>
            <select value={professional} onChange={(e) => setProfessional(e.target.value)}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition">
              <option>Diego Barbeiro</option>
              <option>Carlos Stylist</option>
              <option>Ana Colorista</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Horário</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Duração (minutos)</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition">
              {[15,20,30,40,45,50,60,90,120].map((d) => (
                <option key={d} value={d}>{d} min</option>
              ))}
            </select>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-sm font-semibold transition">
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const APPT_COLORS = [
  "bg-violet-500/20 border-violet-500/40 text-violet-300",
  "bg-teal-500/20 border-teal-500/40 text-teal-300",
  "bg-amber-500/20 border-amber-500/40 text-amber-300",
  "bg-rose-500/20 border-rose-500/40 text-rose-300",
  "bg-sky-500/20 border-sky-500/40 text-sky-300",
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [currentDate,  setCurrentDate]  = useState(new Date());
  const [showModal,    setShowModal]    = useState(false);
  const [clickedDate,  setClickedDate]  = useState<string | undefined>();
  const [clickedTime,  setClickedTime]  = useState<string | undefined>();

  const weekDates = getWeekDates(currentDate);
  const todayStr  = fmt(new Date());

  function prevWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }

  function nextWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  function goToday() { setCurrentDate(new Date()); }

  function handleCellClick(date: string, time: string) {
    setClickedDate(date);
    setClickedTime(time);
    setShowModal(true);
  }

  function handleSave(appt: Omit<Appointment, "id" | "color">) {
    const color = APPT_COLORS[appointments.length % APPT_COLORS.length];
    setAppointments((prev) => [...prev, { id: Date.now(), ...appt, color }]);
    setShowModal(false);
  }

  const weekStart = weekDates[0];
  const weekEnd   = weekDates[6];
  const weekLabel = weekStart.getMonth() === weekEnd.getMonth()
    ? `${weekStart.getDate()} — ${weekEnd.getDate()} ${MONTHS_FULL_PT[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`
    : `${weekStart.getDate()} ${MONTHS_PT[weekStart.getMonth()]} — ${weekEnd.getDate()} ${MONTHS_PT[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  return (
    <div className="flex flex-col h-full bg-zinc-950">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={goToday}
            className="px-3 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition">
            Hoje
          </button>
          <button onClick={nextWeek}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-zinc-300 text-sm font-medium hidden sm:inline">{weekLabel}</span>
        </div>

        <button
          onClick={() => { setClickedDate(todayStr); setClickedTime("09:00"); setShowModal(true); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2 text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo agendamento
        </button>
      </div>

      {/* Grade */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[640px]">

          {/* Header dos dias */}
          <div className="grid border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10"
            style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
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

          {/* Slots de horário */}
          <div className="relative">
            {TIME_SLOTS.map((slot, si) => (
              <div key={slot} className="grid border-b border-zinc-800/50"
                style={{ gridTemplateColumns: "56px repeat(7, 1fr)", height: `${SLOT_HALF}px` }}>
                {/* Label do horário — só nas horas cheias */}
                <div className="border-r border-zinc-800 flex items-start justify-end pr-2 pt-1 shrink-0">
                  {si % 2 === 0 && (
                    <span className="text-xs text-zinc-600">{slot}</span>
                  )}
                </div>
                {weekDates.map((d, di) => (
                  <div key={di}
                    onClick={() => handleCellClick(fmt(d), slot)}
                    className="border-r border-zinc-800/50 last:border-r-0 hover:bg-zinc-800/20 cursor-pointer transition relative"
                  />
                ))}
              </div>
            ))}

            {/* Agendamentos posicionados absolutamente */}
            {appointments.map((appt) => {
              const colIndex = weekDates.findIndex((d) => fmt(d) === appt.date);
              if (colIndex === -1) return null;

              const startMin  = timeToMinutes(appt.startTime);
              const startFrom = timeToMinutes("08:00");
              const topPx     = ((startMin - startFrom) / 30) * SLOT_HALF;
              const heightPx  = Math.max((appt.duration / 30) * SLOT_HALF - 2, 24);

              // largura de cada coluna: (100% - 56px) / 7
              const colWidth  = `calc((100% - 56px) / 7)`;
              const leftVal   = `calc(56px + ${colIndex} * (100% - 56px) / 7 + 2px)`;

              return (
                <div key={appt.id}
                  className={`absolute border rounded-lg px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-90 transition overflow-hidden ${appt.color}`}
                  style={{ top: topPx + 1, left: leftVal, width: `calc(${colWidth} - 4px)`, height: heightPx }}>
                  <p className="truncate font-semibold leading-tight">{appt.client}</p>
                  {heightPx > 32 && (
                    <p className="truncate opacity-80 leading-tight">{appt.service}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <NewAppointmentModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialDate={clickedDate}
          initialTime={clickedTime}
        />
      )}
    </div>
  );
}