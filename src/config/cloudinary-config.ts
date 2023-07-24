import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

ConfigModule.forRoot();
const configService = new ConfigService();

export const CloudinaryConfig = cloudinary.config({
  cloud_name: configService.get('CLOUDINARY_NAME'),
  api_key: configService.get('CLOUDINARY_API_KEY'),
  api_secret: configService.get('CLOUDINARY_API_SECRET'),
});
