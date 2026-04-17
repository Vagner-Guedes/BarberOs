import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { clientService } from "../../services/api/clientService";
import type { Client } from "../../services/api/clientService";
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

interface ModalProps {
  client?: Client | null;
  onClose: () => void;
  onSave: (data: { name: string; email?: string; phone: string }) => void;
  loading?: boolean;
}

function ClientModal({ client, onClose, onSave, loading }: ModalProps) {
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Nome e telefone são obrigatórios.");
      return;
    }
    onSave({ name, email, phone });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">{client ? "Editar cliente" : "Novo cliente"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Nome completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: João Silva"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">Telefone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000"
              className="w-full h-10 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">E-mail <span className="text-zinc-600">(opcional)</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com"
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
              {loading ? "Salvando..." : (client ? "Salvar alterações" : "Cadastrar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  client: Client;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

function DeleteModal({ client, onClose, onConfirm, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-1">Remover cliente</h3>
        <p className="text-zinc-500 text-sm text-center mb-6">
          Tem certeza que deseja remover <span className="text-zinc-300 font-medium">{client.name}</span>?
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

export default function ClientsPage() {
  //const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err: unknown) {
      console.error("Erro ao carregar clientes:", err);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === "todos" ? true : filter === "ativos" ? c.active : !c.active;
    return matchSearch && matchFilter;
  });

  async function handleSave(data: { name: string; email?: string; phone: string }) {
    setModalLoading(true);
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, data);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await clientService.create(data);
        toast.success("Cliente cadastrado com sucesso!");
      }
      await loadClients();
      setShowModal(false);
      setEditingClient(null);
    } catch (err: unknown) {
      console.error("Erro ao salvar cliente:", err);
      toast.error("Erro ao salvar cliente");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingClient) return;
    setModalLoading(true);
    try {
      await clientService.delete(deletingClient.id);
      toast.success("Cliente removido com sucesso!");
      await loadClients();
      setDeletingClient(null);
    } catch (err: unknown) {
      let message = "Erro ao remover cliente";
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
      await clientService.update(id, { active: true });
      toast.success("Cliente restaurado com sucesso!");
      await loadClients();
    } catch (err: unknown) {
      console.error("Erro ao restaurar cliente:", err);
      toast.error("Erro ao restaurar cliente");
    }
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setShowModal(true);
  }

  function openNew() {
    setEditingClient(null);
    setShowModal(true);
  }

  const counts = {
    todos: clients.length,
    ativos: clients.filter((c) => c.active).length,
    inativos: clients.filter((c) => !c.active).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Clientes</h1>
          <span className="bg-zinc-800 text-zinc-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            {clients.length}
          </span>
        </div>
        <button onClick={openNew}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-lg px-3 sm:px-4 py-2.5 text-sm transition">
          <span className="hidden sm:inline">Novo cliente</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full h-10 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
        </div>
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1 self-start sm:self-auto">
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

      <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800">
          <span className="col-span-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome</span>
          <span className="col-span-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</span>
          <span className="col-span-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Telefone</span>
          <span className="col-span-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Criado em</span>
          <span className="col-span-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Ações</span>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-zinc-500 text-sm">Nenhum cliente encontrado</p>
            </div>
          ) : (
            filtered.map((client) => (
              <div key={client.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-zinc-800/30 transition items-center">
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 ${getInitialsColor(getInitials(client.name))} rounded-full flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-semibold">{getInitials(client.name)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{client.name}</p>
                    {!client.active && <span className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">Inativo</span>}
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-zinc-400 truncate">{client.email || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-zinc-300">{client.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-zinc-400">{formatDate(client.createdAt)}</p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => openEdit(client)} className="p-2 text-zinc-500 hover:text-amber-500 rounded-lg" title="Editar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {!client.active ? (
                    <button onClick={() => handleRestore(client.id)} className="p-2 text-zinc-500 hover:text-emerald-400 rounded-lg" title="Restaurar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={() => setDeletingClient(client)} className="p-2 text-zinc-500 hover:text-red-400 rounded-lg" title="Remover">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((client) => (
          <div key={client.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 ${getInitialsColor(getInitials(client.name))} rounded-full flex items-center justify-center shrink-0`}>
                  <span className="text-white text-sm font-semibold">{getInitials(client.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{client.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{client.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(client)} className="p-2 text-zinc-500 hover:text-amber-500 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {!client.active ? (
                  <button onClick={() => handleRestore(client.id)} className="p-2 text-zinc-500 hover:text-emerald-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => setDeletingClient(client)} className="p-2 text-zinc-500 hover:text-red-400 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-zinc-600">Telefone</p>
                <p className="text-xs text-zinc-300">{client.phone}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-600">Cadastro</p>
                <p className="text-xs text-zinc-300">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-12 text-center">
            <p className="text-zinc-500 text-sm">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSave={handleSave}
          loading={modalLoading}
        />
      )}
      {deletingClient && (
        <DeleteModal
          client={deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleDelete}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
