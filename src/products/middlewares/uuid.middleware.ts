import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class UuidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    const { category_id } = req.body;

    if (!isValidUUID(category_id))
      throw new BadRequestException('Invalid rol id');
    else next();
  }
}
