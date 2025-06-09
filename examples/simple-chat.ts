import { ChatClientImpl } from '../src/client/chat-client';
import { ChatConfig } from '../src';

async function main() {
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

  try {
    // Connect to the chat server
    await chatClient.connect('user1', 'John Doe');
    console.log('Connected to chat server');

    // Join a channel
    await chatClient.joinChannel('general');
    console.log('Joined channel: general');

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
    console.log('Message sent');

    // Search messages
    const searchResults = await chatClient.searchMessages('hello');
    console.log('Search results:', searchResults);

    // Get channel history
    const history = await chatClient.getChannelHistory('general');
    console.log('Channel history:', history);

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 