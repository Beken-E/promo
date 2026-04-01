import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesController } from './promo-codes.controller';
import { PromoCode } from './entities/promo-code.entity';
import { Activation } from '../activations/entities/activation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, Activation])],
  providers: [PromoCodesService],
  controllers: [PromoCodesController],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
