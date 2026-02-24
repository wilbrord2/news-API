import { ArticleStatus } from '../entities/article.entity';

export type CreatedArticleResponseDto = {
  id: string;
  title: string;
  category: string;
  status: ArticleStatus;
  authorId: string;
  createdAt: Date;
};

export type PublicArticleListItemDto = {
  id: string;
  title: string;
  category: string;
  status: ArticleStatus;
  createdAt: Date;
  author: {
    id: string;
    name: string;
  } | null;
};

export type MineArticleListItemDto = {
  id: string;
  title: string;
  category: string;
  status: ArticleStatus;
  createdAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
};