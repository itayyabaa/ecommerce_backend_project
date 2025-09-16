/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products') // ✅ explicit table name
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // ✅ Price stored in PKR as integer
  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'PKR' })
  currency: string;

  // ✅ Store binary image in Postgres
  @Column({ type: 'bytea', nullable: true })
  image?: Buffer;

  // ✅ Original file name
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageName?: string;

  // ✅ MIME type (e.g. image/png)
  @Column({ type: 'varchar', length: 100, nullable: true })
  imageMime?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

