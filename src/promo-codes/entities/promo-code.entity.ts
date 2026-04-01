import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activation } from '../../activations/entities/activation.entity';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'int' })
  discount: number; // in %

  @Column({ type: 'int' })
  limit: number; // max number of activations

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @OneToMany(() => Activation, (activation) => activation.promoCode)
  activations: Activation[];
}
