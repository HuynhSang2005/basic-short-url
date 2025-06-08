import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';


@Module({
  imports: [],
  controllers: [ShortenerController],
  providers: [],
})
export class AppModule {}
