# MeshTalk

A real-time chat SDK with Elasticsearch integration built with NestJS and Socket.IO.

## Features

- Real-time messaging using WebSocket
- Channel-based chat rooms
- User presence (online/offline status)
- Typing indicators
- Message history
- Elasticsearch integration for message search
- TypeScript support

## Installation

```bash
npm install @gokul1342441/meshtalk
```

## Quick Start

```typescript
import { ChatClientImpl, ChatConfig } from '@gokul1342441/meshtalk';

// Initialize the chat client
const chatConfig: ChatConfig = {
  elasticsearch: {
    node: 'http://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'changeme'
    }
  },
  port: 9090,
  host: 'localhost'
};

const chatClient = new ChatClientImpl(chatConfig);

// Connect to the chat server
await chatClient.connect('user123', 'John Doe');

// Join a channel
await chatClient.joinChannel('general');

// Send a message
await chatClient.sendMessage('general', 'Hello, world!');

// Listen for new messages
chatClient.onMessage((message) => {
  console.log(`New message from ${message.userId}: ${message.content}`);
});

// Listen for user status changes
chatClient.onUserStatus((data) => {
  console.log(`User ${data.userId} is ${data.status}`);
});

// Search messages
const searchResults = await chatClient.searchMessages('hello', 'general');
```

## API Documentation

### ChatClient

- `connect(userId: string, userName: string): Promise<void>`
- `disconnect(): void`
- `joinChannel(channelId: string): Promise<void>`
- `leaveChannel(channelId: string): Promise<void>`
- `sendMessage(channelId: string, content: string, type?: string): Promise<void>`
- `onMessage(callback: (message: Message) => void): void`
- `onUserStatus(callback: (data: { userId: string; status: string }) => void): void`
- `onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void`
- `searchMessages(query: string, channelId?: string): Promise<Message[]>`
- `getChannelHistory(channelId: string): Promise<Message[]>`

## Configuration

The SDK requires the following configuration:

```typescript
interface ChatConfig {
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
```

## License

MIT
