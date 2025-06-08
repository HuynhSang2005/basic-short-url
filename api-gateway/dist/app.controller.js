"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const url_dto_1 = require("./url.dto");
let AppController = class AppController {
    client;
    shortenerService;
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.shortenerService = this.client.getService('ShortenerService');
    }
    async createShortUrl(createShortUrlDto) {
        console.log('📨 API Gateway - Create request:', createShortUrlDto);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.shortenerService.CreateShortUrl({
                originalUrl: createShortUrlDto.url,
            }));
            console.log('✅ API Gateway - Response:', response);
            return {
                short_code: response.shortCode,
                short_url: response.shortUrl,
                original_url: createShortUrlDto.url,
            };
        }
        catch (error) {
            console.error('❌ API Gateway - Error:', error);
            throw new common_1.HttpException('Failed to create short URL', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async redirect(shortCode, res) {
        console.log('📨 API Gateway - Redirect request:', shortCode);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.shortenerService.GetOriginalUrl({
                shortCode: shortCode,
            }));
            console.log('✅ API Gateway - Redirect to:', response.originalUrl);
            return res.redirect(301, response.originalUrl);
        }
        catch (error) {
            console.error('❌ API Gateway - Redirect error:', error);
            throw new common_1.HttpException('URL not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    health() {
        return {
            status: 'OK',
            service: 'API Gateway',
            timestamp: new Date().toISOString()
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('urls'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [url_dto_1.CreateShortUrlDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createShortUrl", null);
__decorate([
    (0, common_1.Get)(':shortCode'),
    __param(0, (0, common_1.Param)('shortCode')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "redirect", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)('SHORTENER_PACKAGE')),
    __metadata("design:paramtypes", [Object])
], AppController);
//# sourceMappingURL=app.controller.js.map