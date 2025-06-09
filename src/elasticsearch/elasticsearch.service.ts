import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    const health = await this.checkHealth();
    if (health.status === 'healthy') {
      this.logger.log('✅ Elasticsearch is running successfully');
    } else {
      this.logger.error('❌ Elasticsearch health check failed:', health.message);
    }
  }

  async checkHealth() {
    try {
      const health = await this.elasticsearchService.ping();
      if (health) {
        const info = await this.elasticsearchService.info();
        return {
          status: 'healthy',
          info: info,
        };
      }
      return {
        status: 'unhealthy',
        message: 'Elasticsearch ping failed',
      };
    } catch (error) {
      this.logger.error('Elasticsearch health check failed', error);
      return {
        status: 'unhealthy',
        message: error.message,
      };
    }
  }

  async index(params: { index: string; document: any }) {
    return this.elasticsearchService.index(params);
  }

  async search(params: any) {
    return this.elasticsearchService.search(params);
  }
} 