import redis from 'redis';

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTIONS: 'TRANSACTIONS',
};

export default class RedisServer {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    
    // Create Redis client instances for publisher and subscriber
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Load channels to subscribe to messages from the Redis server
    this.loadChannels();

    // Add event listeners for handling messages from the Redis server
    this.subscriber.on('message', (channel, message) =>
      this.messageHandler(channel, message)
    );

    // Test connection to the Redis server
    this.testConnection();
  }

  // Test connection to the Redis server
  testConnection() {
    this.publisher.on('connect', () => {
      console.log('Publisher connected to Redis server');
    });

    this.subscriber.on('connect', () => {
      console.log('Subscriber connected to Redis server');
    });

    this.publisher.on('error', (err) => {
      console.error('Error connecting to Redis server (Publisher):', err);
    });

    this.subscriber.on('error', (err) => {
      console.error('Error connecting to Redis server (Subscriber):', err);
    });
  }
// Broadcast the blockchain
  broadcastBlockchain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

   // Broadcast a transaction
   broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTIONS,
      message: JSON.stringify(transaction),
    });
  }
  // Load channels to subscribe to messages from the Redis server
  loadChannels() {
    Object.values(CHANNELS).forEach((channel) =>
      this.subscriber.subscribe(channel)
    );
  }

  // Handle messages received from the Redis server
  messageHandler(channel, message) {
    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      console.log('Replacing blockchain with', parsedMessage);
      this.blockchain.replaceChain(parsedMessage);
    } else if (channel === CHANNELS.TRANSACTIONS) {
      console.log('Adding new transaction', parsedMessage);
      this.blockchain.addTransaction(parsedMessage);
    }
  }

  // Send message to the Redis server
  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }
}
