import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { PromoCodesModule } from '../promo-codes/promo-codes.module';

@Module({
  imports: [UsersModule, AccountsModule, PromoCodesModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
