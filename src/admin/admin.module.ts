/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports:[ProductsModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
