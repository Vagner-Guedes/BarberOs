export interface Professional {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  specialties: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
