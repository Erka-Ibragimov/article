import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { ArticleDto } from './dto/article.dto';
import { IAuth } from 'src/common/auth.decorator';
import { AllArticleQuery } from './dto/all-article.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(auth: IAuth, data: ArticleDto) {
    const newArticle = this.articleRepository.create({
      name: data.name,
      author: data.author,
      description: data.description,
      auth: {
        id: auth.id,
      },
    });

    await this.articleRepository.save(newArticle, { reload: true });

    return newArticle;
  }

  async getAll(auth: IAuth, query: AllArticleQuery) {
    const articles = await this.articleRepository.find({
      where: {
        author: query.author,
        auth: { id: auth.id },
        created_at:
          query.startDate && query.endDate
            ? Between(
                dayjs(query.startDate).toDate(),
                dayjs(query.endDate).toDate(),
              )
            : undefined,
      },
      skip: query.page ? query.take * query.page - query.take : 0,
      take: query.take || 10,
    });

    return articles;
  }

  async delete(auth: IAuth, id: number) {
    const article = await this.articleRepository.findOneBy({
      id,
      auth: { id: auth.id },
    });

    if (!article) throw new HttpException('Статья не найдена', 404);

    await this.articleRepository.remove(article);

    return { message: true };
  }

  async update(auth: IAuth, id: number, data: ArticleDto) {
    const article = await this.articleRepository.findOneBy({
      id,
      auth: { id: auth.id },
    });

    if (!article) throw new HttpException('Статья не найдена', 404);

    article.author = data.author;
    article.description = data.description;
    article.name = data.name;

    await this.articleRepository.save(article);

    return { message: true };
  }
}
