"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'shortener',
            protoPath: (0, path_1.join)(__dirname, '../../proto/shortener.proto'),
            url: '0.0.0.0:50051',
        },
    });
    await app.listen();
    console.log('🚀 Shortener Service is running on port 50051');
}
bootstrap();
//# sourceMappingURL=main.js.map