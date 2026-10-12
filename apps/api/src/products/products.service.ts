import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const priceNum =
      Number(createProductDto.price.replace(/[^0-9]/g, '')) || null;

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        priceNum,
        badge: createProductDto.badge || null,
        img: createProductDto.img || null,
        category: createProductDto.category || 'Parfait',
        description: createProductDto.description || null,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const priceNum = updateProductDto.price
      ? Number(updateProductDto.price.replace(/[^0-9]/g, ''))
      : undefined;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(updateProductDto.name !== undefined && {
          name: updateProductDto.name,
        }),
        ...(updateProductDto.price !== undefined && {
          price: updateProductDto.price,
          priceNum,
        }),
        ...(updateProductDto.badge !== undefined && {
          badge: updateProductDto.badge || null,
        }),
        ...(updateProductDto.img !== undefined && {
          img: updateProductDto.img || null,
        }),
        ...(updateProductDto.category !== undefined && {
          category: updateProductDto.category || 'Parfait',
        }),
        ...(updateProductDto.description !== undefined && {
          description: updateProductDto.description || null,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully', product: deleted };
  }
}
