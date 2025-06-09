# Real-time Chat SDK

A powerful real-time chat SDK built with NestJS, WebSocket, and Elasticsearch integration.

## Features

- Real-time messaging using WebSocket
- Channel-based chat rooms
- User presence (online/offline status)
- Typing indicators
- Message history
- Full-text search using Elasticsearch
- TypeScript support

## Installation

```bash
npm install @your-org/chat-sdk
```

## Quick Start

```typescript
import { ChatClientImpl, ChatConfig } from '@your-org/chat-sdk';

// Configure the chat client
const config: ChatConfig = {
  elasticsearch: {
    node: 'http://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'changeme',
    },
  },
  port: 9090,
  host: 'localhost',
};

// Create chat client instance
const chatClient = new ChatClientImpl(config);

// Connect to the chat server
await chatClient.connect('user1', 'John Doe');

// Join a channel
await chatClient.joinChannel('general');

// Set up event listeners
chatClient.onMessage((message) => {
  console.log(`New message from ${message.userId}: ${message.content}`);
});

chatClient.onUserStatus((data) => {
  console.log(`User ${data.userId} is ${data.status}`);
});

chatClient.onTyping((data) => {
  if (data.isTyping) {
    console.log(`User ${data.userId} is typing...`);
  }
});

// Send a message
await chatClient.sendMessage('general', 'Hello, everyone!');

// Search messages
const searchResults = await chatClient.searchMessages('hello');

// Get channel history
const history = await chatClient.getChannelHistory('general');
```

## API Reference

### ChatClient

#### Methods

- `connect(userId: string, userName: string): Promise<void>`
  - Connects to the chat server
  - Parameters:
    - `userId`: Unique identifier for the user
    - `userName`: Display name of the user

- `disconnect(): void`
  - Disconnects from the chat server

- `joinChannel(channelId: string): Promise<void>`
  - Joins a chat channel
  - Parameters:
    - `channelId`: Unique identifier for the channel

- `leaveChannel(channelId: string): Promise<void>`
  - Leaves a chat channel
  - Parameters:
    - `channelId`: Unique identifier for the channel

- `sendMessage(channelId: string, content: string, type?: string): Promise<void>`
  - Sends a message to a channel
  - Parameters:
    - `channelId`: Channel to send the message to
    - `content`: Message content
    - `type`: Message type (default: 'text')

- `searchMessages(query: string, channelId?: string): Promise<Message[]>`
  - Searches for messages
  - Parameters:
    - `query`: Search query
    - `channelId`: Optional channel filter

- `getChannelHistory(channelId: string): Promise<Message[]>`
  - Gets message history for a channel
  - Parameters:
    - `channelId`: Channel to get history for

#### Event Handlers

- `onMessage(callback: (message: Message) => void): void`
  - Handles new messages

- `onUserStatus(callback: (data: { userId: string; status: string }) => void): void`
  - Handles user status changes

- `onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void`
  - Handles typing indicators

### Types

```typescript
interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

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

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
```bash
   npm run start:dev
   ```

## License

MIT
# MeshTalk
