import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels/:channelId/messages')
  async getChannelHistory(@Param('channelId') channelId: string) {
    return this.chatService.getChannelHistory(channelId);
  }

  @Get('search')
  async searchMessages(
    @Query('query') query: string,
    @Query('channelId') channelId?: string,
  ) {
    return this.chatService.searchMessages(query, channelId);
  }
} 