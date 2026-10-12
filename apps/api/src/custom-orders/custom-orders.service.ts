import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';

@Injectable()
export class CustomOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomOrderDto: CreateCustomOrderDto) {
    const request = await this.prisma.customOrderRequest.create({
      data: {
        base: createCustomOrderDto.base,
        fruits: createCustomOrderDto.fruits,
        toppings: createCustomOrderDto.toppings,
        packaging: createCustomOrderDto.packaging,
        quantity: createCustomOrderDto.quantity,
        eventDate: createCustomOrderDto.eventDate || null,
        notes: createCustomOrderDto.notes || null,
      },
    });

    return {
      message: 'Custom order request submitted successfully',
      request,
    };
  }
}
