export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
