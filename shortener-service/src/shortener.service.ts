import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid'; 

@Injectable()
export class ShortenerService {
  private prisma = new PrismaClient();

  async createShortUrl(originalUrl: string): Promise<{ shortCode: string; shortUrl: string }> {
    const shortCode = nanoid(8); 
    console.log('🔢 Generated shortCode:', shortCode);
    
    await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    });

    console.log('✅ URL stored in database');

    return {
      shortCode,
      shortUrl: `http://localhost:3000/${shortCode}`,
    };
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    return url.originalUrl;
  }
}