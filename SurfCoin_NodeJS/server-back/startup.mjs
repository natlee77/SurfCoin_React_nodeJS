import Blockchain from './models/Blockchain.mjs';
import RedisServer from './redis-server.mjs';

export const blockchain = new Blockchain();
export const redisServer = new RedisServer({ blockchain: blockchain });
