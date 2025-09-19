/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ default: 'PKR' })
  currency: string;

  @ApiProperty({ required: false })
  imageName?: string;

  @ApiProperty({ required: false })
  imageMime?: string;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
