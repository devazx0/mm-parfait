import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsBoolean()
  @IsOptional()
  storeOpen?: boolean;

  @IsString()
  @IsOptional()
  operatingHours?: string;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  emailDigest?: boolean;

  @IsString()
  @IsOptional()
  deliveryZones?: string;
}
