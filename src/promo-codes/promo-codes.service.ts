import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { Activation } from '../activations/entities/activation.entity';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private readonly promoCodeRepository: Repository<PromoCode>,
    @InjectRepository(Activation)
    private readonly activationRepository: Repository<Activation>,
  ) {}

  async create(createPromoCodeDto: CreatePromoCodeDto): Promise<PromoCode> {
    const existing = await this.promoCodeRepository.findOne({ where: { code: createPromoCodeDto.code } });
    if (existing) {
      throw new ConflictException('Promo code already exists');
    }
    const newPromoCode = this.promoCodeRepository.create(createPromoCodeDto);
    return await this.promoCodeRepository.save(newPromoCode);
  }

  async findAll(): Promise<PromoCode[]> {
    return await this.promoCodeRepository.find({ relations: ['activations'] });
  }

  async findByCode(code: string): Promise<PromoCode | null> {
    return await this.promoCodeRepository.findOne({ where: { code }, relations: ['activations'] });
  }

  async validatePromoCode(code: string, userId?: number, email?: string): Promise<PromoCode> {
    const promoCode = await this.findByCode(code);
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    const now = new Date();
    if (promoCode.expiresAt < now) {
      throw new BadRequestException('Promo code has expired');
    }

    const currentActivations = promoCode.activations.length;
    if (currentActivations >= promoCode.limit) {
      throw new BadRequestException('Promo code activation limit reached');
    }

    if (userId) {
      const alreadyActivated = promoCode.activations.some(a => a.userId === userId);
      if (alreadyActivated) {
        throw new BadRequestException('User has already activated this promo code');
      }
    }

    return promoCode;
  }
}
