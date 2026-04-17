import { useState, useEffect } from "react";
import { serviceService } from "../../services/api/serviceService";
import type { Service } from "../../services/api/serviceService";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type Filter = "todos" | "ativos" | "inativos";

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ModalProps {
  service?: Service | null;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; duration: number; price: number }) => void;
  loading?: boolean;
}

function ServiceModal({ service, onClose, onSave, loading }: ModalProps) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [duration, setDuration] = useState(service?.duration?.toString() ?? "30");
  const [price, setPrice] = useState(service?.price?.toString() ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Nome é obrigatório."); return; }
    if (parseInt(duration) <= 0) { setError("Duração deve ser maior que 0."); return; }
    if (parseFloat(price) < 0) { setError("Preço não pode ser negativo."); return; }
    onSave({ name, description: description || undefined, duration: parseInt(duration), price: parseFloat(price) });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">{service ? "Editar serviço" : "Novo serviço"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div><label className="block text-sm text-zinc-400">Nome</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          <div><label className="block text-sm text-zinc-400">Descrição</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-zinc-400">Duração (min)</label><input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
            <div><label className="block text-sm text-zinc-400">Preço (R$)</label><input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5"><p className="text-red-400 text-sm">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-lg font-semibold">{loading ? "Salvando..." : (service ? "Salvar" : "Cadastrar")}</button>
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
  loading?: boolean;
}

function DeleteModal({ service, onClose, onConfirm, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4"><svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
        <h3 className="text-white font-semibold text-center mb-1">Remover serviço</h3>
        <p className="text-zinc-500 text-sm text-center mb-6">Tem certeza que deseja remover <span className="text-zinc-300 font-medium">{service.name}</span>?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 h-10 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-lg font-semibold">{loading ? "Removendo..." : "Remover"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => { loadServices(); }, []);

  async function loadServices() {
    try {
      setLoading(true);
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err: unknown) {
      console.error("Erro ao carregar serviços:", err);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  const filtered = services.filter(s => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) || (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "todos" ? true : filter === "ativos" ? s.active : !s.active;
    return match && matchFilter;
  });

  async function handleSave(data: { name: string; description?: string; duration: number; price: number }) {
    setModalLoading(true);
    try {
      if (editingService) {
        await serviceService.update(editingService.id, data);
        toast.success("Serviço atualizado!");
      } else {
        await serviceService.create(data);
        toast.success("Serviço cadastrado!");
      }
      await loadServices();
      setShowModal(false);
      setEditingService(null);
    } catch (err: unknown) {
      console.error("Erro ao salvar serviço:", err);
      toast.error("Erro ao salvar serviço");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingService) return;
    setModalLoading(true);
    try {
      await serviceService.delete(deletingService.id);
      toast.success("Serviço removido!");
      await loadServices();
      setDeletingService(null);
    } catch (err: unknown) {
      let message = "Erro ao remover serviço";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as AxiosError<{ error?: string }>;
        message = axiosErr.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleRestore(id: number) {
    try {
      await serviceService.update(id, { active: true });
      toast.success("Serviço restaurado!");
      await loadServices();
    } catch (err: unknown) {
      console.error("Erro ao restaurar serviço:", err);
      toast.error("Erro ao restaurar serviço");
    }
  }

  function openEdit(s: Service) { setEditingService(s); setShowModal(true); }
  function openNew() { setEditingService(null); setShowModal(true); }

  const counts = {
    todos: services.length,
    ativos: services.filter(s => s.active).length,
    inativos: services.filter(s => !s.active).length,
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Serviços</h1>
        <button onClick={openNew} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2">Novo serviço</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="flex-1 h-10 bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4" />
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {(["todos","ativos","inativos"] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm capitalize ${filter === f ? "bg-amber-500 text-zinc-950" : "text-zinc-400"}`}>{f} ({counts[f]})</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-white font-semibold">{s.name}</h3>
            {s.description && <p className="text-zinc-400 text-sm mt-1">{s.description}</p>}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs bg-zinc-800 text-amber-400 px-2 py-1 rounded">⏱️ {formatDuration(s.duration)}</span>
              <span className="text-sm font-semibold text-emerald-400">{formatPrice(s.price)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(s)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg">Editar</button>
              {!s.active ? (
                <button onClick={() => handleRestore(s.id)} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg">Restaurar</button>
              ) : (
                <button onClick={() => setDeletingService(s)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg">Excluir</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-zinc-500 py-12">Nenhum serviço encontrado</div>}
      </div>
      {showModal && <ServiceModal service={editingService} onClose={() => { setShowModal(false); setEditingService(null); }} onSave={handleSave} loading={modalLoading} />}
      {deletingService && <DeleteModal service={deletingService} onClose={() => setDeletingService(null)} onConfirm={handleDelete} loading={modalLoading} />}
    </div>
  );
}
