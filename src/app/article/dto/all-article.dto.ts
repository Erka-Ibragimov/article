import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AllArticleQuery {
  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  startDate: string | Date;

  @IsOptional()
  @IsString()
  endDate: string | Date;

  @IsOptional()
  @Transform((data) => {
    return Number(data.value);
  })
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform((data) => {
    return Number(data.value);
  })
  @IsNumber()
  take: number;
}
