import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleService } from './article.service';
import { Article } from './entity/article.entity';
import { ArticleDto } from './dto/article.dto';
import { IAuth } from 'src/common/auth.decorator';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((article) => Promise.resolve({ ...article })),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const auth: IAuth = { id: 1, login: 'test' };
      const data: ArticleDto = {
        name: 'Test Article',
        author: 'Erka',
        description: 'This is a test article.',
      };

      jest.spyOn(articleRepository, 'create').mockReturnValue({
        ...data,
        auth: {
          id: auth.id,
          created_at: new Date('2024-08-08T02:11:55.777Z'),
          updated_at: new Date('2024-08-08T02:11:55.777Z'),
          login: 'test',
          password: '',
          articles: [],
        },
        id: 1,
        created_at: new Date('2024-08-08T02:11:55.777Z'),
        updated_at: new Date('2024-08-08T02:11:55.777Z'),
      });

      jest.spyOn(articleRepository, 'save').mockResolvedValue({
        id: 1,
        ...data,
        created_at: new Date('2024-08-08T02:11:55.777Z'),
        updated_at: new Date('2024-08-08T02:11:55.777Z'),
        auth: {
          id: auth.id,
          created_at: new Date('2024-08-08T02:11:55.777Z'),
          updated_at: new Date('2024-08-08T02:11:55.777Z'),
          login: 'test',
          password: '',
          articles: [],
        },
      });

      const result = await service.create(auth, data);

      expect(articleRepository.create).toHaveBeenCalledWith({
        name: data.name,
        author: data.author,
        description: data.description,
        auth: {
          id: auth.id,
        },
      });
      expect(articleRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        ...data,
        auth: {
          id: auth.id,
          created_at: new Date('2024-08-08T02:11:55.777Z'),
          updated_at: new Date('2024-08-08T02:11:55.777Z'),
          login: 'test',
          password: '',
          articles: [],
        },
        created_at: new Date('2024-08-08T02:11:55.777Z'),
        updated_at: new Date('2024-08-08T02:11:55.777Z'),
      });
    });
  });

  // describe('getAll', () => {
  //   it('should return articles based on the query', async () => {
  //     const auth: IAuth = {
  //       id: 1,
  //       login: '',
  //     };
  //     const query: AllArticleQuery = {
  //       author: 'John Doe',
  //       startDate: '2023-01-01',
  //       endDate: '2023-12-31',
  //       page: 1,
  //       take: 10,
  //     };

  //     jest.spyOn(articleRepository, 'find').mockResolvedValue([
  //       {
  //         id: 1,
  //         name: 'Test Article 1',
  //         author: 'John Doe',
  //         description: 'This is a test article.',
  //         auth: {
  //           id: auth.id,
  //           created_at: undefined,
  //           updated_at: undefined,
  //           login: '',
  //           password: '',
  //           articles: [],
  //         },
  //         created_at: new Date('2023-05-01'),
  //       },
  //       {
  //         id: 2,
  //         name: 'Test Article 2',
  //         author: 'John Doe',
  //         description: 'This is another test article.',
  //         auth: {
  //           id: auth.id,
  //           created_at: undefined,
  //           updated_at: undefined,
  //           login: '',
  //           password: '',
  //           articles: [],
  //         },
  //         created_at: new Date('2023-06-15'),
  //       },
  //     ]);

  //     const result = await service.getAll(auth, query);

  //     expect(articleRepository.find).toHaveBeenCalledWith({
  //       where: {
  //         author: query.author,
  //         auth: { id: auth.id },
  //         created_at: Between(new Date('2023-01-01'), new Date('2023-12-31')),
  //       },
  //       skip: (query.page - 1) * query.take,
  //       take: query.take,
  //     });
  //     expect(result).toHaveLength(2);
  //   });
  // });

  // describe('delete', () => {
  //   it('should delete an article', async () => {
  //     const auth: IAuth = {
  //       id: 1,
  //       login: '',
  //     };
  //     const articleId = 1;

  //     jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue({
  //       id: articleId,
  //       name: 'Test Article',
  //       author: 'John Doe',
  //       description: 'This is a test article.',
  //       auth: {
  //         id: auth.id,
  //         created_at: undefined,
  //         updated_at: undefined,
  //         login: '',
  //         password: '',
  //         articles: [],
  //       },
  //     });
  //     jest.spyOn(articleRepository, 'remove').mockResolvedValue(undefined);

  //     const result = await service.delete(auth, articleId);

  //     expect(articleRepository.findOneBy).toHaveBeenCalledWith({
  //       id: articleId,
  //       auth: { id: auth.id },
  //     });
  //     expect(articleRepository.remove).toHaveBeenCalled();
  //     expect(result).toEqual({ message: true });
  //   });

  //   it('should throw an exception if the article is not found', async () => {
  //     const auth: IAuth = {
  //       id: 1,
  //       login: '',
  //     };
  //     const articleId = 1;

  //     jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue(null);

  //     await expect(service.delete(auth, articleId)).rejects.toThrow(
  //       HttpException,
  //     );
  //   });
  // });

  // describe('update', () => {
  //   it('should update an article', async () => {
  //     const auth: IAuth = {
  //       id: 1,
  //       login: '',
  //     };
  //     const articleId = 1;
  //     const data: ArticleDto = {
  //       name: 'Updated Article',
  //       author: 'Jane Doe',
  //       description: 'This is an updated article.',
  //     };

  //     jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue({
  //       id: articleId,
  //       name: 'Test Article',
  //       author: 'John Doe',
  //       description: 'This is a test article.',
  //       auth: {
  //         id: auth.id,
  //         created_at: undefined,
  //         updated_at: undefined,
  //         login: '',
  //         password: '',
  //         articles: [],
  //       },
  //     });
  //     jest.spyOn(articleRepository, 'save').mockResolvedValue(undefined);

  //     const result = await service.update(auth, articleId, data);

  //     expect(articleRepository.findOneBy).toHaveBeenCalledWith({
  //       id: articleId,
  //       auth: { id: auth.id },
  //     });
  //     expect(articleRepository.save).toHaveBeenCalled();
  //     expect(result).toEqual({ message: true });
  //   });

  //   it('should throw an exception if the article is not found', async () => {
  //     const auth: IAuth = {
  //       id: 1,
  //       login: '',
  //     };
  //     const articleId = 1;
  //     const data: ArticleDto = {
  //       name: 'Updated Article',
  //       author: 'Jane Doe',
  //       description: 'This is an updated article.',
  //     };

  //     jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue(null);

  //     await expect(service.update(auth, articleId, data)).rejects.toThrow(
  //       HttpException,
  //     );
  //   });
  // });
});
