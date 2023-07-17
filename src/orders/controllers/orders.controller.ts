import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Request() req: Request, @Body() order: CreateOrderDTO) {
    return await this.orderService.create(order, req['user'].sub);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOrders(@Request() req: Request) {
    return await this.orderService.getOrders(req['user'].sub);
  }
}
