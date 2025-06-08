import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { CreateShortUrlDto } from './url.dto';
export declare class AppController implements OnModuleInit {
    private client;
    private shortenerService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    createShortUrl(createShortUrlDto: CreateShortUrlDto): Promise<{
        short_code: string;
        short_url: string;
        original_url: string;
    }>;
    redirect(shortCode: string, res: Response): Promise<void>;
    health(): {
        status: string;
        service: string;
        timestamp: string;
    };
}
