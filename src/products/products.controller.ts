/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Create Product with Image Upload
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  // ✅ Get All Products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ Get Product by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // ✅ Update Product with optional Image Upload
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(+id, updateProductDto, file);
  }

  // ✅ Delete Product
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // ✅ Fetch product image by product ID
  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.findOne(+id);

    if (!product || !product.image) {
      throw new NotFoundException('Image not found');
    }

    // ✅ Fix TS error: always provide a fallback MIME type
    res.setHeader(
      'Content-Type',
      product.imageMime ?? 'application/octet-stream',
    );

    res.send(product.image);
  }
}
