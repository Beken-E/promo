import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Activation } from '../../activations/entities/activation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  login: string;

  @OneToOne(() => Account, (account) => account.user, { cascade: true })
  account: Account;

  @OneToMany(() => Activation, (activation) => activation.user)
  activations: Activation[];
}
