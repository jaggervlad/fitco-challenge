import api from "./api";
import { Provider, CreateProviderData } from "@/types";

export const providersService = {
  /**
   * Get all providers
   */
  async getAll(): Promise<Provider[]> {
    const { data } = await api.get<Provider[]>("/providers");
    return data;
  },

  /**
   * Get provider by ID
   */
  async getById(id: string): Promise<Provider> {
    const { data } = await api.get<Provider>(`/providers/${id}`);
    return data;
  },

  /**
   * Create new provider
   */
  async create(providerData: CreateProviderData): Promise<Provider> {
    const { data } = await api.post<Provider>("/providers", providerData);
    return data;
  },

  /**
   * Update provider
   */
  async update(
    id: string,
    providerData: Partial<CreateProviderData>
  ): Promise<Provider> {
    const { data } = await api.patch<Provider>(
      `/providers/${id}`,
      providerData
    );
    return data;
  },

  /**
   * Delete provider
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/providers/${id}`);
  },

  /**
   * Get providers by specialty
   */
  async getBySpecialty(specialty: string): Promise<Provider[]> {
    const { data } = await api.get<Provider[]>("/providers", {
      params: { specialty },
    });
    return data;
  },
};
