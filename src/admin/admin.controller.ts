/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ✅ Admin login
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }

  // ✅ Add product with image
  @Post('product')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  addProduct(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.adminService.addProduct(dto, file);
  }

  // ✅ Delete product by ID
  @Delete('product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(+id);
  }
}
