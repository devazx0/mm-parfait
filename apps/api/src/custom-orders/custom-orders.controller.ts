import { Body, Controller, Post } from '@nestjs/common';
import { CustomOrdersService } from './custom-orders.service';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';

@Controller('custom-orders')
export class CustomOrdersController {
  constructor(private readonly customOrdersService: CustomOrdersService) {}

  @Post()
  create(@Body() createCustomOrderDto: CreateCustomOrderDto) {
    return this.customOrdersService.create(createCustomOrderDto);
  }
}
