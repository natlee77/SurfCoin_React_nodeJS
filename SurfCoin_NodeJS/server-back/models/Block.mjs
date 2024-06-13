import { GENESIS_DATA, MINE_RATE } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import hexToBinary from 'hex-to-binary';
export default class Block {
  constructor({ timestamp, blockIndex, lastHash, hash, data, transactions, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.blockIndex = blockIndex;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.transactions = transactions;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  //getter. static method = can be called without creating an instance of the class
  static get genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data, transactions }) {
    //const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const blockIndex = lastBlock.blockIndex + 1;
    let { difficulty } = lastBlock;
    let hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficultyLevel({
        block: lastBlock,
        timestamp,
      });
      hash = createHash(timestamp, lastHash, data, transactions, difficulty, nonce);
    } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({
      timestamp,
      blockIndex: lastBlock.blockIndex + 1,
      lastHash,
      hash,
      data,
      transactions,
      difficulty,
      nonce,
    });
  }

  static adjustDifficultyLevel({ block, timestamp }) {
    const { difficulty } = block;
    // console.log(timestamp - block.timestamp);
    if (timestamp - block.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}
