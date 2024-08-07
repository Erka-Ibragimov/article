import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { Article } from './entity/article.entity';

describe('ArticleService', () => {
  let service: ArticleService;

  const mockAuthRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((article) => Promise.resolve({ ...article })),
    find: jest.fn().mockImplementation((data) => ({ ...data })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    expect(
      await service.create(
        { id: 1, login: 'q' },
        { name: 'q', description: 'q', author: 'q' },
      ),
    ).toEqual({
      name: 'q',
      description: 'q',
      author: 'q',
      auth: { id: 1 },
    });
  });
});
