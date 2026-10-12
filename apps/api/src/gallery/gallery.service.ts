import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems() {
    return this.prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async updateItems(updateGalleryDto: UpdateGalleryDto) {
    await this.prisma.$transaction(async (tx) => {
      await tx.galleryItem.deleteMany({});
      for (let i = 0; i < updateGalleryDto.items.length; i++) {
        const item = updateGalleryDto.items[i];
        await tx.galleryItem.create({
          data: {
            title: item.title,
            category: item.category,
            desc: item.desc,
            img: item.img,
            aspect: item.aspect,
            sortOrder: i + 1,
          },
        });
      }
    });

    return {
      message: 'Gallery updated successfully',
      items: await this.getItems(),
    };
  }
}
