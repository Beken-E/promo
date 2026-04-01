import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { PromoCodesService } from '../promo-codes/promo-codes.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { Activation } from '../activations/entities/activation.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly promoCodesService: PromoCodesService,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, login, password, promoCode: code } = registerDto;

    // 1. Pre-validate promo code if provided
    let promoCodeEntity = null;
    if (code) {
      promoCodeEntity = await this.promoCodesService.validatePromoCode(code);
    }

    // 2. Use Transaction to ensure all or nothing
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create User
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = queryRunner.manager.create(User, {
        email,
        login,
        password: hashedPassword,
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create Account
      const bonus = promoCodeEntity ? 100 : 0; // Example bonus: 100 if promo code used
      const account = queryRunner.manager.create(Account, {
        userId: savedUser.id,
        balance: bonus,
      });
      await queryRunner.manager.save(account);

      // Record Activation
      if (promoCodeEntity) {
        const activation = queryRunner.manager.create(Activation, {
          userId: savedUser.id,
          promoCodeId: promoCodeEntity.id,
        });
        await queryRunner.manager.save(activation);
      }

      await queryRunner.commitTransaction();
      return savedUser;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23505') { // Postgres Unique Constraint Error
        throw new ConflictException('User with this email or login already exists');
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
