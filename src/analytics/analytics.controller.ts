import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, Role, Roles } from '../__helpers__';
import { AccessTokenGuard, RbacGuard } from '../auth/guards';
import type { AuthUser } from '../__helpers__/decorators/current-user.decorator';
import { QueryArticlesDto } from '../article/dto/query-articles.dto';

@Controller('author')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Author)
  dashboard(@CurrentUser() user: AuthUser, @Query() query: QueryArticlesDto) {
    return this.analyticsService.getAuthorDashboard(
      user.sub,
      query.pageNumber || 1,
      query.pageSize || 10,
    );
  }
}
