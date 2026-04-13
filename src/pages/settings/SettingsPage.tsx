import { useState } from "react";

interface SalonSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  openTime: string;
  closeTime: string;
  workDays: number[];
}

interface NotificationSettings {
  emailConfirmation: boolean;
  emailReminder: boolean;
  whatsappReminder: boolean;
  reminderHours: number;
}

interface AccountSettings {
  ownerName: string;
  ownerEmail: string;
}

const WEEK_DAYS = [
  { label: "Dom", value: 0 },
  { label: "Seg", value: 1 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 3 },
  { label: "Qui", value: 4 },
  { label: "Sex", value: 5 },
  { label: "Sáb", value: 6 },
];

type Tab = "salon" | "notifications" | "account" | "security";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "salon",
    label: "Estabelecimento",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Minha conta",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Segurança",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-amber-500" : "bg-zinc-700"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

function SaveButton({ saved }: { saved: boolean }) {
  return (
    <button
      type="submit"
      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-5 py-2.5 text-sm transition"
    >
      {saved ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Salvo!
        </>
      ) : (
        "Salvar alterações"
      )}
    </button>
  );
}

// ── Aba: Estabelecimento ──────────────────────────────────────────────────────
function SalonTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<SalonSettings>({
    name: "Barbearia do Vagner",
    phone: "(71) 99999-0000",
    email: "contato@barbervagner.com",
    address: "Rua das Flores, 123 — Salvador, BA",
    openTime: "08:00",
    closeTime: "20:00",
    workDays: [1, 2, 3, 4, 5, 6],
  });

  function toggleDay(day: number) {
    setForm((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day].sort(),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h3 className="text-white font-semibold text-sm">Informações do estabelecimento</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm text-zinc-400">Nome do estabelecimento</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Telefone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm text-zinc-400">Endereço</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h3 className="text-white font-semibold text-sm">Horário de funcionamento</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Abertura</label>
            <input
              type="time"
              value={form.openTime}
              onChange={(e) => setForm({ ...form, openTime: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Fechamento</label>
            <input
              type="time"
              value={form.closeTime}
              onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Dias de funcionamento</label>
          <div className="flex gap-2 flex-wrap">
            {WEEK_DAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`w-12 h-10 rounded-lg text-sm font-medium transition ${
                  form.workDays.includes(d.value)
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

// ── Aba: Notificações ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<NotificationSettings>({
    emailConfirmation: true,
    emailReminder: true,
    whatsappReminder: false,
    reminderHours: 24,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const items = [
    {
      key: "emailConfirmation" as const,
      label: "Confirmação por e-mail",
      description: "Enviar e-mail ao cliente quando um agendamento for criado.",
    },
    {
      key: "emailReminder" as const,
      label: "Lembrete por e-mail",
      description: "Enviar lembrete por e-mail antes do horário marcado.",
    },
    {
      key: "whatsappReminder" as const,
      label: "Lembrete por WhatsApp",
      description: "Enviar lembrete via WhatsApp antes do horário marcado.",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between px-6 py-4 gap-4">
            <div>
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{item.description}</p>
            </div>
            <Toggle
              checked={form[item.key]}
              onChange={(v) => setForm({ ...form, [item.key]: v })}
            />
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
        <h3 className="text-white font-semibold text-sm">Antecedência do lembrete</h3>
        <p className="text-zinc-500 text-xs">Quantas horas antes do agendamento o lembrete será enviado.</p>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 6, 12, 24, 48].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setForm({ ...form, reminderHours: h })}
              className={`px-4 h-9 rounded-lg text-sm font-medium transition ${
                form.reminderHours === h
                  ? "bg-amber-500 text-zinc-950"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

// ── Aba: Minha Conta ──────────────────────────────────────────────────────────
function AccountTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<AccountSettings>({
    ownerName: "Vagner Silva",
    ownerEmail: "admin@barber.com",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-amber-500 text-xl font-semibold">VS</span>
          </div>
          <div>
            <p className="text-white font-semibold">{form.ownerName}</p>
            <p className="text-zinc-500 text-sm">Administrador</p>
            <button type="button" className="text-amber-500 text-xs hover:text-amber-400 transition mt-1">
              Alterar foto
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold text-sm">Dados pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Nome completo</label>
            <input
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">E-mail</label>
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

// ── Aba: Segurança ────────────────────────────────────────────────────────────
function SecurityTab() {
  const [saved, setSaved] = useState(false);
  const [currentPassword,  setCurrentPassword]  = useState("");
  const [newPassword,      setNewPassword]      = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [error,            setError]            = useState("");
  const [show,             setShow]             = useState({ current: false, new: false, confirm: false });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!currentPassword) { setError("Informe a senha atual.");         return; }
    if (newPassword.length < 6) { setError("Nova senha: mínimo 6 caracteres."); return; }
    if (newPassword !== confirmPassword) { setError("As senhas não coincidem."); return; }
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 2000);
  }

  function EyeBtn({ field }: { field: "current" | "new" | "confirm" }) {
    return (
      <button type="button" onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition">
        {show[field] ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold text-sm">Alterar senha</h3>

        <div className="space-y-1.5">
          <label className="block text-sm text-zinc-400">Senha atual</label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
            <EyeBtn field="current" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-zinc-400">Nova senha</label>
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
            <EyeBtn field="new" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm text-zinc-400">Confirmar nova senha</label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
            <EyeBtn field="confirm" />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white text-sm font-medium">Sessões ativas</p>
            <p className="text-zinc-500 text-xs mt-0.5">Encerrar todas as outras sessões abertas.</p>
          </div>
          <button type="button"
            className="shrink-0 px-4 h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition">
            Encerrar sessões
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton saved={saved} />
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("salon");

  const content: Record<Tab, React.ReactNode> = {
    salon:         <SalonTab />,
    notifications: <NotificationsTab />,
    account:       <AccountTab />,
    security:      <SecurityTab />,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">

      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Configurações</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Gerencie as preferências do seu estabelecimento</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">

        {/* Sidebar de abas */}
        <nav className="sm:w-48 shrink-0">
          <div className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {content[activeTab]}
        </div>
      </div>
    </div>
  );
}