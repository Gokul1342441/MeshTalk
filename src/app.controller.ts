import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SearchService } from './elasticsearch/elasticsearch.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly searchService: SearchService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/elasticsearch')
  async checkElasticsearchHealth() {
    return this.searchService.checkHealth();
  }
}
