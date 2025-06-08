import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ShortenerService } from './shortener.service';


@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @GrpcMethod('ShortenerService', 'CreateShortUrl')
  async createShortUrl(data: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    console.log('=== SHORTENER SERVICE DEBUG ===');
    console.log('📨 Raw data received:', data);
    console.log('📨 JSON stringify:', JSON.stringify(data, null, 2));
    console.log('📨 data.originalUrl:', data?.originalUrl); 
    
    if (!data.originalUrl) { 
      console.error('❌ Validation failed - originalUrl is missing');
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'originalUrl is required',
      });
    }

    try {
      const result = await this.shortenerService.createShortUrl(data.originalUrl);  
      console.log('✅ CreateShortUrl response:', result);
      
      return {
        shortCode: result.shortCode, 
        shortUrl: result.shortUrl,    
      };
    } catch (error) {
      console.error('❌ CreateShortUrl error:', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to create short URL',
      });
    }
  }

  @GrpcMethod('ShortenerService', 'GetOriginalUrl')
  async getOriginalUrl(data: GetOriginalUrlRequest): Promise<GetOriginalUrlResponse> {
    console.log('📨 GetOriginalUrl request:', data);
    
    if (!data.shortCode) { 
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'shortCode is required',
      });
    }

    try {
      const originalUrl = await this.shortenerService.getOriginalUrl(data.shortCode);  // ← Đổi thành camelCase
      console.log('✅ GetOriginalUrl response:', { originalUrl });
      
      return { originalUrl };  
    } catch (error) {
      console.error('❌ GetOriginalUrl error:', error);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'URL not found',
      });
    }
  }
}