export interface Professional {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  active: boolean;
  createdAt: string;
  initials: string;
}

export const mockProfessionals: Professional[] = [
  {
    id: 1,
    name: "Diego Souza",
    email: "diego@barbershop.com",
    phone: "(11) 99999-1111",
    role: "Barbeiro",
    specialties: ["Corte Masculino", "Barba", "Corte + Barba"],
    active: true,
    createdAt: "10/03/2024",
    initials: "DB"
  },
  {
    id: 2,
    name: "André Stylist",
    email: "andre@barbershop.com",
    phone: "(11) 99999-2222",
    role: "Stylist",
    specialties: ["Corte Masculino", "Pigmentação", "Hidratação Capilar"],
    active: true,
    createdAt: "15/03/2024",
    initials: "AS"
  },
  {
    id: 3,
    name: "Ricardo Barber",
    email: "ricardo@barbershop.com",
    phone: "(11) 99999-3333",
    role: "Barbeiro",
    specialties: ["Corte Masculino", "Barba", "Sobrancelha"],
    active: true,
    createdAt: "20/03/2024",
    initials: "RB"
  }
];

export const mockAppointmentsByProfessional = {
  1: [
    { id: 'a1', client: "João Silva", service: "Corte Masculino", date: "15/04/2026", time: "14:00", status: "Confirmado" },
    { id: 'a2', client: "Pedro Costa", service: "Barba", date: "16/04/2026", time: "10:30", status: "Concluído" },
  ],
  2: [
    { id: 'a3', client: "Maria Santos", service: "Hidratação Capilar", date: "15/04/2026", time: "15:00", status: "Confirmado" },
  ],
  3: [
    { id: 'a4', client: "Lucas Almeida", service: "Corte + Barba", date: "17/04/2026", time: "11:00", status: "Confirmado" },
    { id: 'a5', client: "Rafael Oliveira", service: "Sobrancelha", date: "18/04/2026", time: "09:30", status: "Confirmado" },
  ]
};