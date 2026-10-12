import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.storeSettings.create({
        data: {
          id: 'default',
          storeOpen: true,
          operatingHours: '08:00 AM - 09:00 PM',
          deliveryZones: 'Lagos Island, Lekki, Victoria Island, Ikeja',
          pushNotifications: true,
          emailDigest: false,
        },
      });
    }

    return settings;
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto) {
    const updated = await this.prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(updateSettingsDto.storeOpen !== undefined && {
          storeOpen: updateSettingsDto.storeOpen,
        }),
        ...(updateSettingsDto.operatingHours !== undefined && {
          operatingHours: updateSettingsDto.operatingHours,
        }),
        ...(updateSettingsDto.deliveryZones !== undefined && {
          deliveryZones: updateSettingsDto.deliveryZones,
        }),
        ...(updateSettingsDto.pushNotifications !== undefined && {
          pushNotifications: updateSettingsDto.pushNotifications,
        }),
        ...(updateSettingsDto.emailDigest !== undefined && {
          emailDigest: updateSettingsDto.emailDigest,
        }),
      },
      create: {
        id: 'default',
        storeOpen: updateSettingsDto.storeOpen ?? true,
        operatingHours:
          updateSettingsDto.operatingHours ?? '08:00 AM - 09:00 PM',
        deliveryZones:
          updateSettingsDto.deliveryZones ??
          'Lagos Island, Lekki, Victoria Island, Ikeja',
        pushNotifications: updateSettingsDto.pushNotifications ?? true,
        emailDigest: updateSettingsDto.emailDigest ?? false,
      },
    });

    return {
      message: 'Settings updated successfully',
      settings: updated,
    };
  }
}
