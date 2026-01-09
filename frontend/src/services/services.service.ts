import api from "./api";
import { Service, CreateServiceDto, UpdateServiceDto } from "@/types";

export const servicesService = {
  /**
   * Obtener todos los servicios de un proveedor
   */
  async getAll(providerId: number): Promise<Service[]> {
    const response = await api.get<Service[]>(
      `/providers/${providerId}/services`
    );
    return response.data;
  },

  /**
   * Obtener un servicio por ID
   */
  async getById(providerId: number, serviceId: number): Promise<Service> {
    const response = await api.get<Service>(
      `/providers/${providerId}/services/${serviceId}`
    );
    return response.data;
  },

  /**
   * Crear un nuevo servicio
   */
  async create(providerId: number, data: CreateServiceDto): Promise<Service> {
    const response = await api.post<Service>(
      `/providers/${providerId}/services`,
      data
    );
    return response.data;
  },

  /**
   * Actualizar un servicio
   */
  async update(
    providerId: number,
    serviceId: number,
    data: UpdateServiceDto
  ): Promise<Service> {
    const response = await api.patch<Service>(
      `/providers/${providerId}/services/${serviceId}`,
      data
    );
    return response.data;
  },

  /**
   * Eliminar un servicio
   */
  async delete(providerId: number, serviceId: number): Promise<void> {
    await api.delete(`/providers/${providerId}/services/${serviceId}`);
  },
};
