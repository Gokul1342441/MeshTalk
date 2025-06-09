export * from './chat/chat.service';
export * from './chat/chat.gateway';
export * from './chat/chat.module';
export * from './elasticsearch/elasticsearch.service';
export * from './elasticsearch/elasticsearch.module';
// export * from './interfaces';
export * from './client/chat-client';

// Types
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

export interface ChatConfig {
  elasticsearch: {
    node: string;
    auth: {
      username: string;
      password: string;
    };
  };
  port?: number;
  host?: string;
}

export interface ChatClient {
  connect(userId: string, userName: string): Promise<void>;
  disconnect(): void;
  joinChannel(channelId: string): Promise<void>;
  leaveChannel(channelId: string): Promise<void>;
  sendMessage(channelId: string, content: string, type?: string): Promise<void>;
  onMessage(callback: (message: Message) => void): void;
  onUserStatus(callback: (data: { userId: string; status: string }) => void): void;
  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void;
  searchMessages(query: string, channelId?: string): Promise<Message[]>;
  getChannelHistory(channelId: string): Promise<Message[]>;
} 