import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CurrentUser } from "../auth/decorators";
import { JwtAuthGuard } from "../auth/guards";
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.id);
  }

}
