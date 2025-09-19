/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';   // ✅ use existing auth
import { RolesGuard } from '../auth/roles.guard';        // ✅ role guard
import { Roles } from '../auth/roles.decorator';         // ✅ custom roles decorator

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Create product (Admins only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Product created', type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.productsService.create(dto, file);
  }

  // ✅ Get all products (Public)
  @Get()
  @ApiResponse({ status: 200, description: 'List of products', type: [ProductResponseDto] })
  async findAll() {
    return this.productsService.findAll();
  }

  // ✅ Get one product (Public)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Product found', type: ProductResponseDto })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ✅ Get product image (Public)
  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.findOne(id);
    if (!product || !product.image) throw new NotFoundException('Image not found');

    res.setHeader('Content-Type', product.imageMime || 'image/jpeg');
    res.send(product.image);
  }

  // ✅ Update product (Admins only)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, file);
  }

  // ✅ Delete product (Admins only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product deleted' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
