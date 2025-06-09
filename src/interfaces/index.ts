// Message interface
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

// Chat configuration interface
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

// Chat client interface
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

// User status interface
export interface UserStatus {
  userId: string;
  status: 'online' | 'offline';
}

// Typing status interface
export interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

// Channel interface
export interface Channel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Search response interface
export interface SearchResponse {
  hits: {
    hits: Array<{
      _source: Message & {
        createdAt: string;
        updatedAt: string;
      };
    }>;
  };
} 