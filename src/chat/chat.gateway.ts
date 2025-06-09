import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private userSockets: Map<string, Socket> = new Map();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (!userId) {
      client.disconnect();
      return;
    }
    this.userSockets.set(userId, client);
    this.logger.log(`Client connected: ${userId}`);
    
    // Notify others about user's online status
    client.broadcast.emit('userStatus', {
      userId,
      status: 'online',
    });
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`Client disconnected: ${userId}`);
      
      // Notify others about user's offline status
      client.broadcast.emit('userStatus', {
        userId,
        status: 'offline',
      });
    }
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = client.handshake.auth.userId;
    await client.join(data.channelId);
    this.logger.log(`User ${userId} joined channel ${data.channelId}`);
    
    // Get channel history and send to the user
    const messages = await this.chatService.getChannelHistory(data.channelId);
    client.emit('channelHistory', messages);
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const userId = client.handshake.auth.userId;
    await client.leave(data.channelId);
    this.logger.log(`User ${userId} left channel ${data.channelId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; content: string; type: string },
  ) {
    const userId = client.handshake.auth.userId;
    const message = await this.chatService.createMessage({
      channelId: data.channelId,
      userId,
      content: data.content,
      type: data.type,
    });

    // Broadcast message to all users in the channel
    this.server.to(data.channelId).emit('newMessage', message);
    
    // Store message in Elasticsearch for search functionality
    await this.chatService.indexMessage(message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; isTyping: boolean },
  ) {
    const userId = client.handshake.auth.userId;
    client.to(data.channelId).emit('userTyping', {
      userId,
      isTyping: data.isTyping,
    });
  }
} 