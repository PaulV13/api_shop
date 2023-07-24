import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { UuidMiddleware } from './middlewares/uuid.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), JwtModule.register({})],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidMiddleware)
      .forRoutes(
        { path: 'categories/{:id}', method: RequestMethod.GET },
        { path: 'categories/{:id}', method: RequestMethod.DELETE },
        { path: 'categories/{:id}', method: RequestMethod.PUT },
      );
  }
}
