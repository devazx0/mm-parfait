import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const accessPayload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      type: 'access',
      sessionId,
    };

    const refreshPayload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      type: 'refresh',
      sessionId,
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Persist refresh token session in PostgreSQL database
    await this.prisma.session.create({
      data: {
        adminId: admin.id,
        token: refreshToken,
        expiresAt,
        isRevoked: false,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      // Verify token session exists and is not revoked in PostgreSQL database
      const dbSession = await this.prisma.session.findUnique({
        where: { token: refreshToken },
      });

      if (
        !dbSession ||
        dbSession.isRevoked ||
        dbSession.expiresAt < new Date()
      ) {
        throw new UnauthorizedException('Session expired or logged out');
      }

      const newAccessPayload: JwtPayload = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        type: 'access',
        sessionId: payload.sessionId,
      };

      const newAccessToken = this.jwtService.sign(newAccessPayload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '15m',
      });

      return {
        accessToken: newAccessToken,
        expiresIn: 15 * 60,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshTokenDto?: RefreshTokenDto) {
    if (refreshTokenDto?.refreshToken) {
      try {
        await this.prisma.session.updateMany({
          where: { token: refreshTokenDto.refreshToken },
          data: { isRevoked: true },
        });
      } catch {
        // Silently ignore invalid tokens on logout
      }
    }
    return { message: 'Successfully logged out' };
  }
}
