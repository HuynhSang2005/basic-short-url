export declare class ShortenerService {
    private prisma;
    createShortUrl(originalUrl: string): Promise<{
        shortCode: string;
        shortUrl: string;
    }>;
    getOriginalUrl(shortCode: string): Promise<string>;
}
