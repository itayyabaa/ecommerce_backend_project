/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // ✅ import UsersModule

@Module({
  imports: [
    UsersModule, // ✅ makes UsersService available
    JwtModule.register({
      secret: 'jwt_secret_key', // ⚠️ move to env later
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
