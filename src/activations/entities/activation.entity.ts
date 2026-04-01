import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PromoCode } from '../../promo-codes/entities/promo-code.entity';

@Entity()
export class Activation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => PromoCode, (promoCode) => promoCode.activations)
  @JoinColumn({ name: 'promoCodeId' })
  promoCode: PromoCode;

  @Column()
  promoCodeId: number;

  @CreateDateColumn()
  activatedAt: Date;
}
