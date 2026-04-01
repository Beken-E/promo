import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activation } from './entities/activation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activation])],
  exports: [TypeOrmModule], // Exporting for use in other modules if needed
})
export class ActivationsModule {}
