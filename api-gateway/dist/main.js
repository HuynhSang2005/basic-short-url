"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors();
    await app.listen(3000);
    console.log('🚀 API Gateway is running on http://localhost:3000');
    console.log('📋 Endpoints:');
    console.log('  POST /urls - Create short URL');
    console.log('  GET /:code - Redirect to original URL');
    console.log('  GET /health - Health check');
}
bootstrap();
//# sourceMappingURL=main.js.map