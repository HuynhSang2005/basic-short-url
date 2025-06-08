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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const grpc_js_1 = require("@grpc/grpc-js");
const shortener_service_1 = require("./shortener.service");
let ShortenerController = class ShortenerController {
    shortenerService;
    constructor(shortenerService) {
        this.shortenerService = shortenerService;
    }
    async createShortUrl(data) {
        console.log('=== SHORTENER SERVICE DEBUG ===');
        console.log('📨 Raw data received:', data);
        console.log('📨 JSON stringify:', JSON.stringify(data, null, 2));
        console.log('📨 data.originalUrl:', data?.originalUrl);
        if (!data.originalUrl) {
            console.error('❌ Validation failed - originalUrl is missing');
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.INVALID_ARGUMENT,
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
        }
        catch (error) {
            console.error('❌ CreateShortUrl error:', error);
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.INTERNAL,
                message: 'Failed to create short URL',
            });
        }
    }
    async getOriginalUrl(data) {
        console.log('📨 GetOriginalUrl request:', data);
        if (!data.shortCode) {
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.INVALID_ARGUMENT,
                message: 'shortCode is required',
            });
        }
        try {
            const originalUrl = await this.shortenerService.getOriginalUrl(data.shortCode);
            console.log('✅ GetOriginalUrl response:', { originalUrl });
            return { originalUrl };
        }
        catch (error) {
            console.error('❌ GetOriginalUrl error:', error);
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.NOT_FOUND,
                message: 'URL not found',
            });
        }
    }
};
exports.ShortenerController = ShortenerController;
__decorate([
    (0, microservices_1.GrpcMethod)('ShortenerService', 'CreateShortUrl'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShortenerController.prototype, "createShortUrl", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ShortenerService', 'GetOriginalUrl'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShortenerController.prototype, "getOriginalUrl", null);
exports.ShortenerController = ShortenerController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [shortener_service_1.ShortenerService])
], ShortenerController);
//# sourceMappingURL=shortener.controller.js.map