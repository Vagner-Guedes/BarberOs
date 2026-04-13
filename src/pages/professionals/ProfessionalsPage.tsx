import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockProfessionals, type Professional } from "@/mocks/professionals";

type Filter = "todos" | "ativos" | "inativos";

function getInitialsColor(initials: string) {
  const colors = ["bg-amber-500","bg-violet-500","bg-rose-500","bg-teal-500","bg-sky-500","bg-orange-500","bg-emerald-500","bg-pink-500"];
  return colors[initials.charCodeAt(0) % colors.length];
}

interface ModalProps {
  professional?: Professional | null;
  onClose: () => void;
  onSave: (data: Omit<Professional, "id" | "createdAt" | "initials" | "active">) => void;
}

function ProfessionalModal({ professional, onClose, onSave }: ModalProps) {
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
            <button type="submit"
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-sm font-semibold transition">
              {professional ? "Salvar alterações" : "Cadastrar"}
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
}

function DeleteModal({ professional, onClose, onConfirm }: DeleteModalProps) {
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
          <button onClick={onConfirm}
            className="flex-1 h-10 bg-red-500 hover:bg-red-400 text-white rounded-lg text-sm font-semibold transition">
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalsPage() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);

  const filtered = professionals.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "todos" ? true : filter === "ativos" ? p.active : !p.active;
    return matchSearch && matchFilter;
  });

  function handleSave(data: Omit<Professional, "id" | "createdAt" | "initials" | "active">) {
    const initials = data.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    if (editingProfessional) {
      setProfessionals((prev) => prev.map((p) => 
        p.id === editingProfessional.id ? { ...p, ...data, initials } : p
      ));
    } else {
      setProfessionals((prev) => [{
        id: Date.now(),
        ...data,
        initials,
        createdAt: new Date().toLocaleDateString("pt-BR"),
        active: true
      }, ...prev]);
    }
    setShowModal(false);
    setEditingProfessional(null);
  }

  function handleDelete() {
    if (!deletingProfessional) return;
    setProfessionals((prev) => prev.filter((p) => p.id !== deletingProfessional.id));
    setDeletingProfessional(null);
  }

  function handleRestore(id: number) {
    setProfessionals((prev) => prev.map((p) => p.id === id ? { ...p, active: true } : p));
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

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Cabeçalho */}
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

      {/* Busca + Filtros */}
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

      {/* Cards de Profissionais - Layout estilo o da imagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-12 text-center">
            <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-zinc-500 text-sm">Nenhum profissional encontrado</p>
          </div>
        ) : (
          filtered.map((professional) => (
            <div key={professional.id}
              className={`bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition ${
                !professional.active ? "opacity-60" : ""
              }`}>
              
              {/* Header do Card */}
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getInitialsColor(professional.initials)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">{professional.initials}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">{professional.name}</h3>
                      {!professional.active && (
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Inativo</span>
                      )}
                    </div>
                    <p className="text-amber-400 text-sm">{professional.role}</p>
                    {professional.active && (
                      <span className="inline-block text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded mt-1">
                        Ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              <div className="p-4 border-b border-zinc-800">
                <div className="flex flex-wrap gap-1.5">
                  {professional.specialties.map((specialty, idx) => (
                    <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="p-4 flex gap-2">
                <button 
                  onClick={() => navigate(`/professionals/${professional.id}`)}
                  className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver agenda
                </button>
                
                <button 
                  onClick={() => openEdit(professional)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition"
                  title="Editar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {!professional.active ? (
                  <button 
                    onClick={() => handleRestore(professional.id)}
                    className="px-3 py-2 bg-zinc-800 hover:bg-emerald-500/20 rounded-lg text-zinc-300 hover:text-emerald-400 transition"
                    title="Restaurar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    onClick={() => setDeletingProfessional(professional)}
                    className="px-3 py-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg text-zinc-300 hover:text-red-400 transition"
                    title="Remover"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modais */}
      {showModal && (
        <ProfessionalModal
          professional={editingProfessional}
          onClose={() => { setShowModal(false); setEditingProfessional(null); }}
          onSave={handleSave}
        />
      )}
      {deletingProfessional && (
        <DeleteModal
          professional={deletingProfessional}
          onClose={() => setDeletingProfessional(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}