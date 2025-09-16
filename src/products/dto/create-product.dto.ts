/* eslint-disable prettier/prettier */
export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category?: string;
  stock?: number;
}
