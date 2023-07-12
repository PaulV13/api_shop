import { Body, Controller, Post, Get } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDTO } from '../dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  async create(@Body() order: CreateOrderDTO) {
    return await this.orderService.create(order);
  }

  @Get()
  async getOrders() {
    return await this.orderService.getOrders();
  }
}
