export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  CLIENT = 'client',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  DELETED = 'deleted',
}

export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phone: string | null,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isBlocked(): boolean {
    return this.status === UserStatus.BLOCKED;
  }

  isDeleted(): boolean {
    return this.status === UserStatus.DELETED;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isProvider(): boolean {
    return this.role === UserRole.PROVIDER;
  }

  isClient(): boolean {
    return this.role === UserRole.CLIENT;
  }
}
