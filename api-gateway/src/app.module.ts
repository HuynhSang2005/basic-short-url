import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SHORTENER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'shortener',
          protoPath: join(__dirname, '../../proto/shortener.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}