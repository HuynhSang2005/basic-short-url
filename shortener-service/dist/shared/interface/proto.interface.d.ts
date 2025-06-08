interface CreateShortUrlRequest {
    originalUrl: string;
}
interface CreateShortUrlResponse {
    shortCode: string;
    shortUrl: string;
}
interface GetOriginalUrlRequest {
    shortCode: string;
}
interface GetOriginalUrlResponse {
    originalUrl: string;
}
