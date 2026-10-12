import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

const statusStyles: Record<string, string> = {
  Processing: 'bg-primary-container text-on-primary-container',
  Pending:
    'bg-surface-container text-on-surface-variant border border-surface-variant',
  Completed: 'bg-surface-dim text-on-surface',
  Cancelled: 'border border-error text-error bg-error-container/20',
  Shipped: 'bg-surface text-on-surface border border-outline-variant',
};

const deliveryFees: Record<string, number> = {
  standard: 1500,
  express: 3500,
  pickup: 0,
};

const FREE_DELIVERY_THRESHOLD = 5000;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where =
      status && status !== 'All Orders'
        ? { status: status as OrderStatus }
        : {};

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return orders.map((o) => ({
      ...o,
      statusStyle: statusStyles[o.status] || '',
    }));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      ...order,
      statusStyle: statusStyles[order.status] || '',
    };
  }

  async create(createOrderDto: CreateOrderDto) {
    const subtotal = createOrderDto.items.reduce(
      (sum, item) => sum + item.priceNum * item.quantity,
      0,
    );

    let deliveryFee = deliveryFees[createOrderDto.deliveryMethod] ?? 0;
    if (
      createOrderDto.deliveryMethod === 'standard' &&
      subtotal >= FREE_DELIVERY_THRESHOLD
    ) {
      deliveryFee = 0;
    }

    const totalAmount = subtotal + deliveryFee;
    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerName: createOrderDto.customerName,
        customerEmail: createOrderDto.customerEmail,
        customerPhone: createOrderDto.customerPhone,
        deliveryAddress: createOrderDto.deliveryAddress,
        deliveryMethod: createOrderDto.deliveryMethod,
        deliveryFee,
        notes: createOrderDto.notes || null,
        initials: this.buildInitials(createOrderDto.customerName),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        total: `₦${totalAmount.toLocaleString()}`,
        totalAmount,
        status: OrderStatus.Pending,
        items: {
          create: createOrderDto.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return {
      ...order,
      statusStyle: statusStyles[order.status] || '',
    };
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.order.update({
      where: { id: existing.id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: { items: true },
    });

    return {
      ...updated,
      statusStyle: statusStyles[updated.status] || '',
    };
  }

  private buildInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    for (let attempt = 0; attempt < 5; attempt++) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `MMP-${date}-${rand}`;
      const existing = await this.prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) {
        return orderNumber;
      }
    }
    throw new ConflictException('Could not generate a unique order number');
  }
}
