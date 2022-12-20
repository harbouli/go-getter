import { Min, Max, IsPositive } from 'class-validator';
export class PaginationQueryDto {
  @Min(1)
  page: number;
  @IsPositive()
  @Min(1)
  @Max(100)
  perPage: number;
}
