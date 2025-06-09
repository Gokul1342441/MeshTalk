import { Socket } from 'socket.io-client/build/esm/socket';
import { io } from 'socket.io-client/build/esm/index';
import { ChatClient, Message, ChatConfig } from '../index';

export class ChatClientImpl implements ChatClient {
  private socket: Socket;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private userStatusCallbacks: ((data: { userId: string; status: string }) => void)[] = [];
  private typingCallbacks: ((data: { userId: string; isTyping: boolean }) => void)[] = [];
  private baseUrl: string;

  constructor(private config: ChatConfig) {
    const port = config.port || 9090;
    const host = config.host || 'localhost';
    this.baseUrl = `http://${host}:${port}`;
  }

  async connect(userId: string, userName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${this.baseUrl}/chat`, {
        auth: { userId, userName },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        this.setupEventListeners();
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  async joinChannel(channelId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinChannel', { channelId }, (error?: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async leaveChannel(channelId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('leaveChannel', { channelId }, (error?: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async sendMessage(channelId: string, content: string, type: string = 'text'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('sendMessage', { channelId, content, type }, (error?: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onUserStatus(callback: (data: { userId: string; status: string }) => void): void {
    this.userStatusCallbacks.push(callback);
  }

  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void {
    this.typingCallbacks.push(callback);
  }

  async searchMessages(query: string, channelId?: string): Promise<Message[]> {
    const response = await fetch(
      `${this.baseUrl}/chat/search?query=${encodeURIComponent(query)}${
        channelId ? `&channelId=${encodeURIComponent(channelId)}` : ''
      }`
    );
    return response.json();
  }

  async getChannelHistory(channelId: string): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/chat/channels/${channelId}/messages`);
    return response.json();
  }

  private setupEventListeners(): void {
    this.socket.on('newMessage', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('userStatus', (data: { userId: string; status: string }) => {
      this.userStatusCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('userTyping', (data: { userId: string; isTyping: boolean }) => {
      this.typingCallbacks.forEach(callback => callback(data));
    });
  }
} 