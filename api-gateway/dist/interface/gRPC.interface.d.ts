import { Observable } from 'rxjs';
export interface ShortenerGrpcService {
    CreateShortUrl(data: {
        originalUrl: string;
    }): Observable<{
        shortCode: string;
        shortUrl: string;
    }>;
    GetOriginalUrl(data: {
        shortCode: string;
    }): Observable<{
        originalUrl: string;
    }>;
}
