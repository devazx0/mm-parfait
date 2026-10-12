import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'])
  status!: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
}
