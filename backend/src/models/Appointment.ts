export interface Appointment {
  id: number;
  clientId: number;
  professionalId: number;
  serviceId: number;
  date: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
