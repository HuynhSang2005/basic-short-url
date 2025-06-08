"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenerService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
let ShortenerService = class ShortenerService {
    prisma = new client_1.PrismaClient();
    async createShortUrl(originalUrl) {
        const shortCode = (0, nanoid_1.nanoid)(8);
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
    async getOriginalUrl(shortCode) {
        const url = await this.prisma.url.findUnique({
            where: { shortCode },
        });
        if (!url) {
            throw new Error('URL not found');
        }
        return url.originalUrl;
    }
};
exports.ShortenerService = ShortenerService;
exports.ShortenerService = ShortenerService = __decorate([
    (0, common_1.Injectable)()
], ShortenerService);
//# sourceMappingURL=shortener.service.js.map