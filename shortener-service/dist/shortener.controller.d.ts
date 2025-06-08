import { ShortenerService } from './shortener.service';
export declare class ShortenerController {
    private readonly shortenerService;
    constructor(shortenerService: ShortenerService);
    createShortUrl(data: CreateShortUrlRequest): Promise<CreateShortUrlResponse>;
    getOriginalUrl(data: GetOriginalUrlRequest): Promise<GetOriginalUrlResponse>;
}
