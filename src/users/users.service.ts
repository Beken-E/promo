import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, relations: ['account'] });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login }, relations: ['account'] });
  }

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async findAllWithRelations(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['account', 'activations', 'activations.promoCode'],
    });
  }
}
