export interface Service {
  id: number;
  providerId: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
}
