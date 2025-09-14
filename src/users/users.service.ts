/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';   // ✅ import UserRole
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  // ✅ Register new user
  async createUser(dto: CreateUserDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already taken');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      ...dto,
      password: hashed,
      role:
        dto.email === 'admin@gmail.com' && dto.password === 'admin123'
          ? UserRole.ADMIN   // ✅ use enum instead of string
          : UserRole.USER,
    });

    return await this.usersRepo.save(user);   // ✅ save returns the entity
  }

  // ✅ Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  // ✅ Find user by ID (for UsersController)
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
