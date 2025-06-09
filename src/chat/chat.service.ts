import { Injectable, Logger } from '@nestjs/common';
import { SearchService } from '../elasticsearch/elasticsearch.service';

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

interface SearchHit {
  _source: Message & {
    createdAt: string;
    updatedAt: string;
  };
}

interface SearchResponse {
  hits: {
    hits: SearchHit[];
  };
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly messageIndex = 'chat_messages';

  constructor(private readonly searchService: SearchService) {}

  async createMessage(data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    const message: Message = {
      id: this.generateMessageId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store message in memory (you might want to use Redis or a database in production)
    this.messages.set(message.id, message);
    
    return message;
  }

  async getChannelHistory(channelId: string): Promise<Message[]> {
    // In production, you'd want to paginate this
    const messages = Array.from(this.messages.values())
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return messages;
  }

  async indexMessage(message: Message): Promise<void> {
    try {
      await this.searchService.index({
        index: this.messageIndex,
        document: {
          ...message,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      this.logger.error('Failed to index message:', error);
    }
  }

  async searchMessages(query: string, channelId?: string): Promise<Message[]> {
    try {
      const searchQuery = {
        index: this.messageIndex,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['content', 'metadata.*'],
                },
              },
              ...(channelId ? [{ term: { channelId } }] : []),
            ],
          },
        },
        sort: [{ createdAt: 'desc' }],
      };

      const result = await this.searchService.search(searchQuery) as SearchResponse;
      return result.hits.hits.map(hit => ({
        ...hit._source,
        createdAt: new Date(hit._source.createdAt),
        updatedAt: new Date(hit._source.updatedAt),
      }));
    } catch (error) {
      this.logger.error('Failed to search messages:', error);
      return [];
    }
  }

  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // In-memory storage (replace with Redis or database in production)
  private messages: Map<string, Message> = new Map();
} 