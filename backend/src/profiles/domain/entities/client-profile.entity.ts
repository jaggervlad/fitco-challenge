export class ClientProfile {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly preferredLanguage: string | null,
    public readonly birthdate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
