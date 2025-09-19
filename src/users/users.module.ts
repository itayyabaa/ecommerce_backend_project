/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
      secret: process.env.JWT_SECRET || 'a-string-secret-at-least-256-bits-long',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => AdminModule),
],      // ✅ this line is required
  providers: [UsersService, JwtModule],
  controllers: [UsersController],
  exports: [UsersService], // ✅ so AuthModule can use UsersService
})
export class UsersModule {}
