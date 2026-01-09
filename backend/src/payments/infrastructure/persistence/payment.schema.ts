import { EntitySchema } from 'typeorm';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payment.entity';

export const PaymentSchema = new EntitySchema<Payment>({
  name: 'Payment',
  tableName: 'payments',
  target: Payment,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    reservationId: {
      name: 'reservation_id',
      type: Number,
    },
    status: {
      type: 'enum',
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    amount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    method: {
      type: 'enum',
      enum: PaymentMethod,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    reservationId: {
      type: 'many-to-one',
      target: 'Reservation',
      joinColumn: {
        name: 'reservation_id',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  indices: [
    {
      name: 'IDX_PAYMENT_RESERVATION_ID',
      columns: ['reservationId'],
    },
    {
      name: 'IDX_PAYMENT_STATUS',
      columns: ['status'],
    },
  ],
});
