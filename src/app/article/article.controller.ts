import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { Auth, IAuth } from 'src/common/auth.decorator';
import { AllArticleQuery } from './dto/all-article.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Auth() auth: IAuth, @Body() data: ArticleDto) {
    const article = await this.articleService.create(auth, data);

    await this.cacheManager.reset();

    return article;
  }

  @ApiQuery({ name: 'author', required: false, example: 'Erka' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, example: 3 })
  @ApiQuery({ name: 'take', required: false, example: 15 })
  @Get()
  async getAll(
    @Auth() auth: IAuth,
    @Query()
    query: AllArticleQuery,
    @Req() request: Request,
  ) {
    try {
      const value = await this.cacheManager.get(request.url);

      if (value) return JSON.parse(value as string);

      const articles = await this.articleService.getAll(auth, query);

      await this.cacheManager.set(request.url, JSON.stringify(articles));

      return articles;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Delete('/:id')
  async delete(@Auth() auth: IAuth, @Param('id', ParseIntPipe) id: number) {
    const result = await this.articleService.delete(auth, id);

    await this.cacheManager.reset();

    return result;
  }

  @Patch('/:id')
  async update(
    @Auth() auth: IAuth,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ArticleDto,
  ) {
    const result = await this.articleService.update(auth, id, data);

    await this.cacheManager.reset();

    return result;
  }
}
