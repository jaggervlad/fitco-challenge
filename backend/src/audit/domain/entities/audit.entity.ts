export class Audit {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly action: string,
    public readonly entity: string,
    public readonly entityId: number,
    public readonly metadata: Record<string, any>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
