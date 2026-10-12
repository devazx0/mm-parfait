import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { HomepageModule } from './homepage/homepage.module';
import { SettingsModule } from './settings/settings.module';
import { GalleryModule } from './gallery/gallery.module';
import { CustomOrdersModule } from './custom-orders/custom-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DashboardModule,
    OrdersModule,
    ProductsModule,
    HomepageModule,
    SettingsModule,
    GalleryModule,
    CustomOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
