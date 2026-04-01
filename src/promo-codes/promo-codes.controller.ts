import { Controller, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { PromoCode } from './entities/promo-code.entity';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promo code' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Promo code created.', type: PromoCode })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Code already exists.' })
  async create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return await this.promoCodesService.create(createPromoCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all promo codes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of promo codes.', type: [PromoCode] })
  async findAll() {
    return await this.promoCodesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get promo code details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Promo code found.', type: PromoCode })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Promo code not found.' })
  async findByCode(@Param('code') code: string) {
    return await this.promoCodesService.findByCode(code);
  }
}
