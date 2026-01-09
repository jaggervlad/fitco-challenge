export interface Provider {
  _id: string;
  userId: string;
  specialty: string;
  description?: string;
  available: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderData {
  specialty: string;
  description?: string;
  available?: boolean;
}
