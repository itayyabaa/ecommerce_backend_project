/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // ✅ Create product with optional image
  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    // 1. create entity from DTO only
    const product = this.repo.create(createProductDto);

    // 2. add image if provided
    if (file) {
      product.image = file.buffer;
      product.imageName = file.originalname;
      product.imageMime = file.mimetype;
    }

    return this.repo.save(product);
  }

  // ✅ Get all products
  async findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  // ✅ Get one product
  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // ✅ Update product (including optional image)
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // update text fields
    Object.assign(product, updateProductDto);

    // update image if new file uploaded
    if (file) {
      product.image = file.buffer;
      product.imageName = file.originalname;
      product.imageMime = file.mimetype;
    }

    return this.repo.save(product);
  }

  // ✅ Delete product
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.repo.remove(product);
  }
}
