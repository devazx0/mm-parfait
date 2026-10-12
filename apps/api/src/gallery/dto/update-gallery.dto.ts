import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateGalleryItemDto {
  @IsString()
  title!: string;

  @IsString()
  category!: string;

  @IsString()
  desc!: string;

  @IsString()
  img!: string;

  @IsString()
  aspect!: string;
}

export class UpdateGalleryDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateGalleryItemDto)
  items!: UpdateGalleryItemDto[];
}
