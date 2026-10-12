import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  getContent() {
    return this.homepageService.getContent();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateContent(@Body() updateHomepageDto: UpdateHomepageDto) {
    return this.homepageService.updateContent(updateHomepageDto);
  }
}
