import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(userId: number, initialBalance: number = 0): Promise<Account> {
    const newAccount = this.accountRepository.create({
      userId,
      balance: initialBalance,
    });
    return await this.accountRepository.save(newAccount);
  }

  async getAccountByUserId(userId: number): Promise<Account | null> {
    return this.accountRepository.findOne({ where: { userId } });
  }
}
