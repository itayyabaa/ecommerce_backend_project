/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Request } from 'express';

// Extend Express Request to include JWT payload
interface JwtRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'JWT token' })
  async login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  // JWT-protected: Get current user profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: JwtRequest) {
    const userId = req.user.id; // Type-safe access
    return this.usersService.findOne(userId);
  }

  // JWT-protected: Update current user profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Req() req: JwtRequest, @Body() data: Partial<any>) {
    const userId = req.user.id; // Type-safe access
    return this.usersService.updateProfile(userId, data);
  }
}
