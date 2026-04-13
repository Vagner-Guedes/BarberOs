export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    initials: string;
    active: boolean;
  }
  
  export interface Appointment {
    id: number;
    service: string;
    professional: string;
    date: string;
    status: "Confirmado" | "Concluído" | "Cancelado";
  }
  
  export const mockClients: Client[] = [
    { id: 1, name: "Lucas Oliveira",   email: "lucas@email.com",   phone: "(11) 98765-4321", createdAt: "15/03/2025", initials: "LO", active: true },
    { id: 2, name: "Marcos Santos",    email: "marcos@email.com",   phone: "(11) 91234-5678", createdAt: "20/03/2025", initials: "MS", active: true },
    { id: 3, name: "Pedro Henrique",   email: "pedro@email.com",    phone: "(11) 99876-5432", createdAt: "01/04/2025", initials: "PH", active: true },
    { id: 4, name: "Rafael Costa",     email: "rafael@email.com",   phone: "(11) 92345-6789", createdAt: "05/04/2025", initials: "RC", active: true },
    { id: 5, name: "Bruno Almeida",    email: "bruno@email.com",    phone: "(11) 93456-7890", createdAt: "06/04/2025", initials: "BA", active: true },
    { id: 6, name: "Carlos Eduardo",   email: "carlos@email.com",   phone: "(11) 94567-8901", createdAt: "10/02/2025", initials: "CE", active: false },
    { id: 7, name: "Felipe Rodrigues", email: "felipe@email.com",   phone: "(11) 95678-9012", createdAt: "07/04/2025", initials: "FR", active: true },
    { id: 8, name: "Gabriel Lima",     email: "gabriel@email.com",  phone: "(11) 96789-0123", createdAt: "07/04/2025", initials: "GL", active: true },
  ];
  
  export const mockAppointmentsByClient: Record<number, Appointment[]> = {
    1: [
      { id: 1, service: "Corte Masculino", professional: "Diego Barbeiro", date: "10/04/2026 às 09:00", status: "Confirmado" },
      { id: 2, service: "Barba",           professional: "Diego Barbeiro", date: "09/04/2026 às 11:00", status: "Concluído"  },
    ],
    2: [
      { id: 3, service: "Corte Degradê",   professional: "Diego Barbeiro", date: "08/04/2026 às 10:00", status: "Concluído"  },
    ],
    3: [
      { id: 4, service: "Barba",           professional: "Diego Barbeiro", date: "07/04/2026 às 14:00", status: "Concluído"  },
    ],
  };