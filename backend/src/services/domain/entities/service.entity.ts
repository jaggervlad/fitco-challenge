import { User } from 'src/users/domain/entities/user.entity';

export type ServiceData = {
  id: number;
  providerId: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateServiceData = Omit<
  ServiceData,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateServiceData = Partial<Omit<CreateServiceData, 'providerId'>>;

export class Service {
  constructor(
    public readonly id: number,
    public readonly providerId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly durationMinutes: number,
    public readonly price: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly provider?: User,
  ) {}

  // Factory method: Crear desde objeto plano
  static from(data: ServiceData): Service {
    return new Service(
      data.id,
      data.providerId,
      data.name,
      data.description,
      data.durationMinutes,
      data.price,
      data.createdAt,
      data.updatedAt,
    );
  }

  static create(data: CreateServiceData): Service {
    const now = new Date();
    return new Service(
      0,
      data.providerId,
      data.name,
      data.description,
      data.durationMinutes,
      data.price,
      now,
      now,
    );
  }

  static build(partial: Partial<ServiceData>): Service {
    const now = new Date();
    return new Service(
      partial.id ?? 0,
      partial.providerId ?? 0,
      partial.name ?? '',
      partial.description ?? '',
      partial.durationMinutes ?? 0,
      partial.price ?? 0,
      partial.createdAt ?? now,
      partial.updatedAt ?? now,
    );
  }

  clone(updates?: UpdateServiceData): Service {
    return new Service(
      this.id,
      this.providerId,
      updates?.name ?? this.name,
      updates?.description ?? this.description,
      updates?.durationMinutes ?? this.durationMinutes,
      updates?.price ?? this.price,
      this.createdAt,
      new Date(),
    );
  }

  toJSON(): ServiceData {
    return {
      id: this.id,
      providerId: this.providerId,
      name: this.name,
      description: this.description,
      durationMinutes: this.durationMinutes,
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isValid(): boolean {
    return (
      this.name.length > 0 &&
      this.durationMinutes > 0 &&
      this.price >= 0 &&
      this.providerId > 0
    );
  }
}
