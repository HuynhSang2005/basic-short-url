// src/shortener.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { nanoid } from 'nanoid';
import { status } from '@grpc/grpc-js';
import { PrismaService } from './shared/services/prisma.service';

@Controller()
export class ShortenerController {
  constructor(private readonly prisma: PrismaService) {}

  @GrpcMethod('Shortener', 'CreateShortURL')
  async createShortURL(data: { long_url: string }): Promise<{ short_code: string }> {
    const short_code = nanoid(8); // Tạo code ngắn 8 ký tự
    await this.prisma.url.create({
      data: {
        longUrl: data.long_url,
        shortCode: short_code,
      },
    });
    return { short_code };
  }

  @GrpcMethod('Shortener', 'GetLongURL')
  async getLongURL(data: { short_code: string }): Promise<{ long_url: string }> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode: data.short_code },
    });

    if (!url) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'URL not found',
      });
    }

    return { long_url: url.longUrl };
  }
}