import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FeaturedItemDto {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  title!: string;

  @IsString()
  price!: string;

  @IsString()
  desc!: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsOptional()
  sortOrder?: number;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}

export class ClassicItemDto {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  title!: string;

  @IsString()
  price!: string;

  @IsString()
  desc!: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsOptional()
  sortOrder?: number;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}

export class TestimonialItemDto {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  text!: string;

  @IsNumber()
  rating!: number;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}

export class StatItemDto {
  @IsString()
  id!: string;

  @IsString()
  label!: string;

  @IsString()
  value!: string;

  @IsOptional()
  sortOrder?: number;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
}

export class UpdateHomepageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeaturedItemDto)
  @IsOptional()
  featured?: FeaturedItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassicItemDto)
  @IsOptional()
  classics?: ClassicItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDto)
  @IsOptional()
  testimonials?: TestimonialItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatItemDto)
  @IsOptional()
  stats?: StatItemDto[];
}
