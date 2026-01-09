export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  TRANSFER = 'transfer',
  PAYPAL = 'paypal',
}

export class Payment {
  constructor(
    public readonly id: number,
    public readonly reservationId: number,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  isRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }
}
