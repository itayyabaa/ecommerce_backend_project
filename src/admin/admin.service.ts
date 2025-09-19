/* eslint-disable prettier/prettier */
// src/admin/admin.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
     private blacklist: string[] = []; // Store invalidated tokens
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterAdminDto): Promise<Admin> {
    const exists = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ ...dto, password: hashedPassword });
    return this.adminRepo.save(admin);
  }

  async login(dto: LoginAdminDto): Promise<{ accessToken: string }> {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new NotFoundException('Admin not found');

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const payload = { id: admin.id, email: admin.email, role: 'admin' };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepo.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }
    logout(token: string): { message: string } {
     this.blacklist.push(token);
    return { message: 'Admin logged out successfully' };
}
    isTokenBlacklisted(token: string): boolean {
    return this.blacklist.includes(token);}
}
