/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async create(createDto: CreateProductDto, file?: Express.Multer.File) {
    const product = this.repo.create({
      ...createDto,
      currency: createDto.currency ?? 'PKR',
      category: createDto.category ?? 'clothing',
      stock: createDto.stock ?? 0,
    });

    if (file) {
      product.image = file.buffer;
      product.imageName = file.originalname;
      product.imageMime = file.mimetype;
    }

    return this.repo.save(product);
  }

  async findAll(skip = 0, take = 20) {
    return this.repo.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'name',
        'description',
        'price',
        'currency',
        'category',
        'stock',
        'createdAt',
        'updatedAt',
        'imageName',
      ],
    });
  }

  async findOne(id: string | number) {
    const product = await this.repo.findOne({ where: { id: Number(id) } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string | number,
    updateDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const product = await this.findOne(id);
    Object.assign(product, updateDto);

    if (file) {
      product.image = file.buffer;
      product.imageName = file.originalname;
      product.imageMime = file.mimetype;
    }

    return this.repo.save(product);
  }

  async remove(id: string | number) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }

  async adjustStock(id: string | number, delta: number) {
    const product = await this.findOne(id);
    const newStock = product.stock + delta;
    if (newStock < 0) throw new BadRequestException('Insufficient stock');
    product.stock = newStock;
    return this.repo.save(product);
  }
}
