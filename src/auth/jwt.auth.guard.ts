/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';

// Define the structure of JWT payload
interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Extend Express Request to include user
interface JwtRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService, // Inject AdminService
  ) {}

    canActivate(context: ExecutionContext):boolean {
    const request = context.switchToHttp().getRequest<JwtRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      // Decode JWT token
      const decoded = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'a-string-secret-at-least-256-bits-long',
      });

      // Check if token is blacklisted
      if ( this.adminService.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token has been logged out');
      }

      request.user = decoded; // Attach decoded payload to request
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
