import { useState, useEffect } from "react";
import { professionalService } from "../../services/api/professionalService";
import type { Professional } from "../../services/api/professionalService";

type Filter = "todos" | "ativos" | "inativos";

function getInitialsColor(initials: string) {
  const colors = ["bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-teal-500", "bg-sky-500", "bg-orange-500", "bg-emerald-500", "bg-pink-500"];
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Nome completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Diego Souza"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Cargo/Função</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition">
              <option value="">Selecione um cargo</option>
              <option value="Barbeiro">Barbeiro</option>
              <option value="Cabeleireiro">Cabeleireiro</option>
              <option value="Stylist">Stylist</option>
              <option value="Especialista">Especialista</option>
              <option value="Auxiliar">Auxiliar</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Telefone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">E-mail <span className="text-zinc-600">(opcional)</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@studio.com"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Especialidades <span className="text-zinc-600">(separadas por vírgula)</span></label>
            <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="Ex: Corte, Barba, Sobrancelha"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
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
            <button type="submit" disabled={loading}
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 rounded-lg text-sm font-semibold transition">
              {loading ? "Salvando..." : (professional ? "Salvar alterações" : "Cadastrar")}
            </button>
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
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-1">Remover profissional</h3>
        <p className="text-zinc-500 text-sm text-center mb-6">
          Tem certeza que deseja remover <span className="text-zinc-300 font-medium">{professional.name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 h-10 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition">
            {loading ? "Removendo..." : "Remover"}
          </button>
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
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = professionals.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "todos" ? true : filter === "ativos" ? p.active : !p.active;
    return matchSearch && matchFilter;
  });

  async function handleSave(data: { name: string; email?: string; phone: string; role: string; specialties: string[] }) {
    setModalLoading(true);
    try {
      if (editingProfessional) {
        await professionalService.update(editingProfessional.id, data);
      } else {
        await professionalService.create(data);
      }
      await loadProfessionals();
      setShowModal(false);
      setEditingProfessional(null);
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingProfessional) return;
    setModalLoading(true);
    try {
      await professionalService.delete(deletingProfessional.id);
      await loadProfessionals();
      setDeletingProfessional(null);
    } catch (error) {
      console.error("Erro ao deletar profissional:", error);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleRestore(id: number) {
    try {
      await professionalService.update(id, { active: true });
      await loadProfessionals();
    } catch (error) {
      console.error("Erro ao restaurar profissional:", error);
    }
  }

  function openEdit(professional: Professional) {
    setEditingProfessional(professional);
    setShowModal(true);
  }

  function openNew() {
    setEditingProfessional(null);
    setShowModal(true);
  }

  const counts = {
    todos: professionals.length,
    ativos: professionals.filter((p) => p.active).length,
    inativos: professionals.filter((p) => !p.active).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Profissionais</h1>
          <span className="bg-zinc-800 text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            {professionals.length}
          </span>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-4 py-2.5 text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, telefone ou cargo..."
            className="w-full h-10 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-12 text-center">
            <p className="text-zinc-500 text-sm">Nenhum profissional encontrado</p>
          </div>
        ) : (
          filtered.map((professional) => (
            <div key={professional.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${getInitialsColor(getInitials(professional.name))} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">{getInitials(professional.name)}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{professional.name}</h3>
                  <p className="text-amber-400 text-sm">{professional.role}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {professional.specialties.map((s, i) => (
                  <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(professional)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm">Editar</button>
                {!professional.active ? (
                  <button onClick={() => handleRestore(professional.id)} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-lg text-sm">Restaurar</button>
                ) : (
                  <button onClick={() => setDeletingProfessional(professional)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg text-sm">Excluir</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ProfessionalModal
          professional={editingProfessional}
          onClose={() => { setShowModal(false); setEditingProfessional(null); }}
          onSave={handleSave}
          loading={modalLoading}
        />
      )}
      {deletingProfessional && (
        <DeleteModal
          professional={deletingProfessional}
          onClose={() => setDeletingProfessional(null)}
          onConfirm={handleDelete}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
