// Export all modules and services
export * from './chat/chat.service';
export * from './chat/chat.gateway';
export * from './chat/chat.module';
export * from './elasticsearch/elasticsearch.service';
export * from './elasticsearch/elasticsearch.module';
export * from './interfaces';
export * from './client/chat-client';

// Re-export types from interfaces
export type {
  Message,
  ChatConfig,
  ChatClient,
  UserStatus,
  TypingStatus,
  Channel,
  SearchResponse
} from './interfaces'; 