/* eslint-disable prettier/prettier */
// src/admin/dto/login-admin.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
