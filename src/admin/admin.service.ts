/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { Express } from 'express';

@Injectable()
export class AdminService {
  private readonly adminEmail = 'admin@gmail.com';
  private readonly adminPassword = 'admin123';

  constructor(private readonly productsService: ProductsService) {}

  // ✅ Admin login
  login(email: string, password: string) {
    if (email === this.adminEmail && password === this.adminPassword) {
      return { message: 'Admin login successful' };
    }
    throw new UnauthorizedException('Invalid admin credentials');
  }

  // ✅ Add product
  addProduct(dto: CreateProductDto, file?: Express.Multer.File) {
    return this.productsService.create(dto, file);
  }

  // ✅ Delete product
  deleteProduct(id: number) {
    return this.productsService.remove(id);
  }
}
