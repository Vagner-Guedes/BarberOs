import { useState, useEffect } from "react";
import { professionalService } from "../../services/api/professionalService";
import type { Professional } from "../../services/api/professionalService";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type Filter = "todos" | "ativos" | "inativos";

function getInitialsColor(initials: string) {
  const colors = ["bg-amber-500","bg-violet-500","bg-rose-500","bg-teal-500","bg-sky-500","bg-orange-500","bg-emerald-500","bg-pink-500"];
  return colors[initials.charCodeAt(0) % colors.length];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface ModalProps {
  professional?: Professional | null;
  onClose: () => void;
  onSave: (data: { name: string; email?: string; phone: string; role: string; specialties: string[] }) => void;
  loading?: boolean;
}

function ProfessionalModal({ professional, onClose, onSave, loading }: ModalProps) {
  const [name, setName] = useState(professional?.name ?? "");
  const [email, setEmail] = useState(professional?.email ?? "");
  const [phone, setPhone] = useState(professional?.phone ?? "");
  const [role, setRole] = useState(professional?.role ?? "");
  const [specialties, setSpecialties] = useState(professional?.specialties.join(", ") ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !role.trim()) {
      setError("Nome, telefone e cargo são obrigatórios.");
      return;
    }
    const specialtiesArray = specialties.split(",").map(s => s.trim()).filter(s => s);
    onSave({ name, email, phone, role, specialties: specialtiesArray });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">{professional ? "Editar profissional" : "Novo profissional"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div><label className="block text-sm text-zinc-400">Nome</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          <div><label className="block text-sm text-zinc-400">Cargo</label><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4"><option value="">Selecione</option><option value="Barbeiro">Barbeiro</option><option value="Cabeleireiro">Cabeleireiro</option><option value="Stylist">Stylist</option><option value="Especialista">Especialista</option><option value="Auxiliar">Auxiliar</option></select></div>
          <div><label className="block text-sm text-zinc-400">Telefone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          <div><label className="block text-sm text-zinc-400">E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          <div><label className="block text-sm text-zinc-400">Especialidades</label><input value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="Corte, Barba" className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4" /></div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5"><p className="text-red-400 text-sm">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-lg font-semibold">{loading ? "Salvando..." : (professional ? "Salvar" : "Cadastrar")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  professional: Professional;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

function DeleteModal({ professional, onClose, onConfirm, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4"><svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
        <h3 className="text-white font-semibold text-center mb-1">Remover profissional</h3>
        <p className="text-zinc-500 text-sm text-center mb-6">Tem certeza que deseja remover <span className="text-zinc-300 font-medium">{professional.name}</span>?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 h-10 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-lg font-semibold">{loading ? "Removendo..." : "Remover"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    try {
      setLoading(true);
      const data = await professionalService.getAll();
      setProfessionals(data);
    } catch (err: unknown) {
      console.error("Erro ao carregar profissionais:", err);
      toast.error("Erro ao carregar profissionais");
    } finally {
      setLoading(false);
    }
  }

  const filtered = professionals.filter(p => {
    const match = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" ? true : filter === "ativos" ? p.active : !p.active;
    return match && matchFilter;
  });

  async function handleSave(data: Omit<Professional, "id" | "createdAt" | "updatedAt" | "initials">) {
    setModalLoading(true);
    try {
      if (editingProfessional) {
        await professionalService.update(editingProfessional.id, data);
        toast.success("Profissional atualizado!");
      } else {
        await professionalService.create(data);
        toast.success("Profissional cadastrado!");
      }
      await loadProfessionals();
      setShowModal(false);
      setEditingProfessional(null);
    } catch (err: unknown) {
      console.error("Erro ao salvar profissional:", err);
      toast.error("Erro ao salvar profissional");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingProfessional) return;
    setModalLoading(true);
    try {
      await professionalService.delete(deletingProfessional.id);
      toast.success("Profissional removido!");
      await loadProfessionals();
      setDeletingProfessional(null);
    } catch (err: unknown) {
      let message = "Erro ao remover profissional";
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
      await professionalService.update(id, { active: true });
      toast.success("Profissional restaurado!");
      await loadProfessionals();
    } catch (err: unknown) {
      console.error("Erro ao restaurar profissional:", err);
      toast.error("Erro ao restaurar profissional");
    }
  }

  function openEdit(p: Professional) { setEditingProfessional(p); setShowModal(true); }
  function openNew() { setEditingProfessional(null); setShowModal(true); }

  const counts = {
    todos: professionals.length,
    ativos: professionals.filter(p => p.active).length,
    inativos: professionals.filter(p => !p.active).length,
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Profissionais</h1>
        <button onClick={openNew} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2">Novo profissional</button>
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
        {filtered.map(p => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getInitialsColor(getInitials(p.name))} rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold text-sm">{getInitials(p.name)}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">{p.name}</h3>
                <p className="text-amber-400 text-sm">{p.role}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {p.specialties.map((s, i) => <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{s}</span>)}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(p)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg">Editar</button>
              {!p.active ? (
                <button onClick={() => handleRestore(p.id)} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg">Restaurar</button>
              ) : (
                <button onClick={() => setDeletingProfessional(p)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg">Excluir</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-zinc-500 py-12">Nenhum profissional encontrado</div>}
      </div>
      {showModal && <ProfessionalModal professional={editingProfessional} onClose={() => { setShowModal(false); setEditingProfessional(null); }} onSave={handleSave} loading={modalLoading} />}
      {deletingProfessional && <DeleteModal professional={deletingProfessional} onClose={() => setDeletingProfessional(null)} onConfirm={handleDelete} loading={modalLoading} />}
    </div>
  );
}
