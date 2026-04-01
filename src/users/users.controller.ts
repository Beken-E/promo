import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('report')
  @ApiOperation({ summary: 'Get a full report of all users, their accounts, and activations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a complete user list.' })
  async getReport() {
    const users = await this.usersService.findAllWithRelations();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      login: user.login,
      balance: user.account?.balance ?? 0,
      activations: user.activations.map(a => ({
        code: a.promoCode?.code,
        discount: a.promoCode?.discount,
        activatedAt: a.activatedAt,
      })),
    }));
  }
}
