export class ProviderProfile {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly bio: string | null,
    public readonly companyName: string | null,
    public readonly photoUrl: string | null,
    public readonly location: string | null,
    public readonly experienceYears: number | null,
    public readonly verified: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
