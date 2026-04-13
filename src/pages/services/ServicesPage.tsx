import { useState } from "react";

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  active: boolean;
}

const mockServices: Service[] = [
  { id: 1, name: "Corte Masculino",   duration: 30, price: 35,  active: true  },
  { id: 2, name: "Barba",             duration: 20, price: 25,  active: true  },
  { id: 3, name: "Corte + Barba",     duration: 50, price: 55,  active: true  },
  { id: 4, name: "Corte Degradê",     duration: 40, price: 45,  active: true  },
  { id: 5, name: "Hidratação Capilar",duration: 30, price: 40,  active: true  },
  { id: 6, name: "Coloração",         duration: 90, price: 120, active: false },
];

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Filter = "todos" | "ativos" | "inativos";

interface ModalProps {
  service?: Service | null;
  onClose: () => void;
  onSave: (data: Omit<Service, "id" | "active">) => void;
}

function ServiceModal({ service, onClose, onSave }: ModalProps) {
  const [name,     setName]     = useState(service?.name     ?? "");
  const [duration, setDuration] = useState(service?.duration ?? 30);
  const [price,    setPrice]    = useState(service?.price    ?? 0);
  const [error,    setError]    = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim())  { setError("Nome é obrigatório.");           return; }
    if (duration <= 0) { setError("Duração deve ser maior que 0."); return; }
    if (price < 0)     { setError("Preço não pode ser negativo.");  return; }
    onSave({ name, duration, price });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">
            {service ? "Editar serviço" : "Novo serviço"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Nome do serviço</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Corte Masculino"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Duração (minutos)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="30"
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-zinc-400">Preço (R$)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0,00"
                className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
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
              {service ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  service: Service;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteModal({ service, onClose, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-1">Remover serviço</h3>
        <p className="text-zinc-500 text-sm text-center mb-6">
          Tem certeza que deseja remover{" "}
          <span className="text-zinc-300 font-medium">{service.name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 h-10 bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm font-semibold transition">
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services,        setServices]        = useState<Service[]>(mockServices);
  const [search,          setSearch]          = useState("");
  const [filter,          setFilter]          = useState<Filter>("todos");
  const [showModal,       setShowModal]       = useState(false);
  const [editingService,  setEditingService]  = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" ? true : filter === "ativos" ? s.active : !s.active;
    return matchSearch && matchFilter;
  });

  const counts = {
    todos:    services.length,
    ativos:   services.filter((s) => s.active).length,
    inativos: services.filter((s) => !s.active).length,
  };

  function handleSave(data: Omit<Service, "id" | "active">) {
    if (editingService) {
      setServices((prev) => prev.map((s) => s.id === editingService.id ? { ...s, ...data } : s));
    } else {
      setServices((prev) => [{ id: Date.now(), ...data, active: true }, ...prev]);
    }
    setShowModal(false);
    setEditingService(null);
  }

  function handleDelete() {
    if (!deletingService) return;
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    setDeletingService(null);
  }

  function handleToggleActive(id: number) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  function openEdit(service: Service) { setEditingService(service); setShowModal(true); }
  function openNew()                   { setEditingService(null);    setShowModal(true); }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Serviços</h1>
          <span className="bg-zinc-800 text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            {services.length}
          </span>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2.5 text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo serviço
        </button>
      </div>

      {/* Busca + Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full h-10 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1">
          {(["todos", "ativos", "inativos"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                filter === f ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 text-xs ${filter === f ? "text-zinc-800" : "text-zinc-600"}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de cards */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-12 text-center">
          <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-zinc-500 text-sm">Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((service) => (
            <div key={service.id}
              className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition ${!service.active ? "opacity-60" : ""}`}>

              {/* Ícone + status */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243zm7.364-9.243a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z" />
                  </svg>
                </div>
                {!service.active && (
                  <span className="text-xs bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full">
                    Inativo
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <h3 className="text-white font-semibold text-sm">{service.name}</h3>
                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(service.duration)}
                </div>
                <p className="text-white font-semibold text-base mt-1">
                  {formatPrice(service.price)}
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                <button
                  onClick={() => openEdit(service)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(service.id)}
                  className={`flex-1 flex items-center justify-center h-8 rounded-lg text-xs font-medium transition ${
                    service.active
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {service.active ? "Desativar" : "Ativar"}
                </button>
                <button
                  onClick={() => setDeletingService(service)}
                  className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => { setShowModal(false); setEditingService(null); }}
          onSave={handleSave}
        />
      )}
      {deletingService && (
        <DeleteModal
          service={deletingService}
          onClose={() => setDeletingService(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}