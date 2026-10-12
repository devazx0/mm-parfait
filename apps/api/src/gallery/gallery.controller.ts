import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  getItems() {
    return this.galleryService.getItems();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateItems(@Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.updateItems(updateGalleryDto);
  }
}
