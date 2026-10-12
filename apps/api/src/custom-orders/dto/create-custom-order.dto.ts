import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCustomOrderDto {
  @IsString()
  @IsNotEmpty()
  base!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  fruits!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  toppings!: string[];

  @IsString()
  @IsNotEmpty()
  packaging!: string;

  @IsInt()
  @Min(20)
  quantity!: number;

  @IsString()
  @IsOptional()
  eventDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
