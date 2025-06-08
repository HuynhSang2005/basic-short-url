import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Inject,
  OnModuleInit,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ShortenerGrpcService } from './interface/gRPC.interface';
import { CreateShortUrlDto } from './url.dto';

@Controller()
export class AppController implements OnModuleInit {
  private shortenerService: ShortenerGrpcService;

  constructor(@Inject('SHORTENER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.shortenerService = this.client.getService<ShortenerGrpcService>('ShortenerService');
  }

  @Post('urls')
  async createShortUrl(@Body() createShortUrlDto: CreateShortUrlDto) {
    console.log('📨 API Gateway - Create request:', createShortUrlDto);

    try {
      const response = await firstValueFrom(
        this.shortenerService.CreateShortUrl({
          originalUrl: createShortUrlDto.url,
        })
      ) as { shortCode: string; shortUrl: string };

      console.log('✅ API Gateway - Response:', response);
      return {
        short_code: response.shortCode,
        short_url: response.shortUrl,
        original_url: createShortUrlDto.url,
      };
    } catch (error) {
      console.error('❌ API Gateway - Error:', error);
      throw new HttpException(
        'Failed to create short URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    console.log('📨 API Gateway - Redirect request:', shortCode);

    try {
      const response = await firstValueFrom(
        this.shortenerService.GetOriginalUrl({
          shortCode: shortCode, 
        })
      ) as { originalUrl: string };

      console.log('✅ API Gateway - Redirect to:', response.originalUrl);
      return res.redirect(301, response.originalUrl);
    } catch (error) {
      console.error('❌ API Gateway - Redirect error:', error);
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('health')
  health() {
    return { 
      status: 'OK', 
      service: 'API Gateway', 
      timestamp: new Date().toISOString() 
    };
  }
}