import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async getContent() {
    const [featured, classics, testimonials, stats] = await Promise.all([
      this.prisma.featuredProduct.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.classicProduct.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.statHighlight.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);

    return {
      featured,
      classics,
      testimonials,
      stats,
    };
  }

  async updateContent(updateHomepageDto: UpdateHomepageDto) {
    await this.prisma.$transaction(async (tx) => {
      if (updateHomepageDto.featured) {
        await tx.featuredProduct.deleteMany({});
        for (let i = 0; i < updateHomepageDto.featured.length; i++) {
          const item = updateHomepageDto.featured[i];
          await tx.featuredProduct.create({
            data: {
              productId: item.productId || null,
              title: item.title,
              price: item.price,
              desc: item.desc,
              badge: item.badge || null,
              img: item.img || null,
              sortOrder: i + 1,
            },
          });
        }
      }

      if (updateHomepageDto.classics) {
        await tx.classicProduct.deleteMany({});
        for (let i = 0; i < updateHomepageDto.classics.length; i++) {
          const item = updateHomepageDto.classics[i];
          await tx.classicProduct.create({
            data: {
              productId: item.productId || null,
              title: item.title,
              price: item.price,
              desc: item.desc,
              img: item.img || null,
              sortOrder: i + 1,
            },
          });
        }
      }

      if (updateHomepageDto.testimonials) {
        await tx.testimonial.deleteMany({});
        for (const item of updateHomepageDto.testimonials) {
          await tx.testimonial.create({
            data: {
              name: item.name,
              text: item.text,
              rating: item.rating,
            },
          });
        }
      }

      if (updateHomepageDto.stats) {
        await tx.statHighlight.deleteMany({});
        for (let i = 0; i < updateHomepageDto.stats.length; i++) {
          const item = updateHomepageDto.stats[i];
          await tx.statHighlight.create({
            data: {
              label: item.label,
              value: item.value,
              sortOrder: i + 1,
            },
          });
        }
      }
    });

    const updatedContent = await this.getContent();
    return {
      message: 'Homepage content updated successfully',
      content: updatedContent,
    };
  }
}
