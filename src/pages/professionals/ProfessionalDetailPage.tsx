import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { mockProfessionals, mockAppointmentsByProfessional } from "@/mocks/professionals";

function getInitialsColor(initials: string) {
  const colors = ["bg-amber-500","bg-violet-500","bg-rose-500","bg-teal-500","bg-sky-500","bg-orange-500","bg-emerald-500","bg-pink-500"];
  return colors[initials.charCodeAt(0) % colors.length];
}

function statusStyle(status: string) {
  switch (status) {
    case "Concluído":  return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Confirmado": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Cancelado":  return "bg-red-500/10 text-red-400 border border-red-500/20";
    default:           return "bg-zinc-700 text-zinc-400";
  }
}

export default function ProfessionalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState(mockProfessionals);

  const professional = professionals.find((p) => p.id === Number(id));
  const appointments = mockAppointmentsByProfessional[Number(id)] ?? [];

  if (!professional) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500">Profissional não encontrado.</p>
        <button onClick={() => navigate("/professionals")} className="text-amber-500 text-sm mt-2 hover:underline">
          Voltar para profissionais
        </button>
      </div>
    );
  }

  function toggleActive() {
    setProfessionals((prev) =>
      prev.map((p) => p.id === professional!.id ? { ...p, active: !p.active } : p)
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Voltar */}
      <button
        onClick={() => navigate("/professionals")}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para profissionais
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Card do profissional */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className={`w-20 h-20 ${getInitialsColor(professional.initials)} rounded-full flex items-center justify-center mb-4`}>
            <span className="text-white text-2xl font-semibold">{professional.initials}</span>
          </div>

          <h2 className="text-white font-semibold text-lg">{professional.name}</h2>
          <p className="text-amber-400 text-sm mt-0.5">{professional.role}</p>
          <p className="text-zinc-400 text-sm mt-1">{professional.email || "—"}</p>
          <p className="text-zinc-400 text-sm">{professional.phone}</p>

          {/* Especialidades */}
          <div className="w-full mt-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {professional.specialties.map((specialty, idx) => (
                <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full mt-6 space-y-3 text-left border-t border-zinc-800 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">Cadastro</span>
              <span className="text-zinc-300 text-sm">{professional.createdAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">Status</span>
              <span className={`text-sm font-medium ${professional.active ? "text-emerald-400" : "text-zinc-500"}`}>
                {professional.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">Total de atendimentos</span>
              <span className="text-zinc-300 text-sm">{appointments.length}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={toggleActive}
              className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition"
            >
              {professional.active ? "Desativar" : "Reativar"}
            </button>
            <button
              onClick={() => navigate("/appointments")}
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agendar
            </button>
          </div>
        </div>

        {/* Histórico de atendimentos */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h3 className="text-white font-semibold text-sm">Histórico de atendimentos</h3>
          </div>

          <div className="divide-y divide-zinc-800/50">
            {appointments.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-500 text-sm">Nenhum atendimento encontrado</p>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition">
                  <div>
                    <p className="text-white text-sm font-medium">{appt.service}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Cliente: {appt.client} • {appt.date} às {appt.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}