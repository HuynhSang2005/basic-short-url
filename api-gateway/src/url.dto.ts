import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateShortUrlDto {
  @IsNotEmpty({ message: 'URL is required' })
  @IsString({ message: 'URL must be a string' })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url: string;
}