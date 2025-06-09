import { Module } from '@nestjs/common';
import { SearchModule } from '../elasticsearch/elasticsearch.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [SearchModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {} 