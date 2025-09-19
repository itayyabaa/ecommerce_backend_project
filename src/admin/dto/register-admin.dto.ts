/* eslint-disable prettier/prettier */
// src/admin/dto/register-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
