import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

ConfigModule.forRoot();
const configService = new ConfigService();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'paulvidart@gmail.com',
    pass: configService.get('EMAIL_PASSWORD'),
  },
});

transporter.verify().then(() => console.log('Ready for send emails'));
