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
  async createOrder(@Request() req: Request, @Body() order: CreateOrderDTO) {
    return await this.orderService.createOrder(order, req['user'].sub);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOrdersByUser(@Request() req: Request) {
    return await this.orderService.getOrdersByUser(req['user'].sub);
  }
}
