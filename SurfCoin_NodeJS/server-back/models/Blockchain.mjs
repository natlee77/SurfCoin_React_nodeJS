import Block from '../models/Block.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import Transaction from '../models/Transaction.mjs';
import { redisServer } from  '../startup.mjs';

import writeBlockchainToFile from '../utilities/fileHandler.mjs';
export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis];
    this.pendingTransactions = [];
    this.memberNodes = [];

  }
  //instance method
  addBlock( data ) {
    const block = Block.mineBlock({
      lastBlock: this.chain.at(-1),
      data: data,
      transactions: this.pendingTransactions,
    });

    this.pendingTransactions = [];
    this.chain.push(block);

    redisServer.broadcastBlockchain(); 

    return block;
  }

   createTransaction(amount, sender, recipient) {
    const transaction = new Transaction(amount, sender, recipient);
    this.pendingTransactions.push(transaction);
    return transaction;
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().blockIndex + 1;

  }
  getLastBlock() {
    return this.chain.at(-1);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.validateChain(chain)) return;

    this.chain = chain;
  }

  static validateChain(chain) {
    // if (chain.at(0) !== Block.genesis) return false <-- not correct way!!!
    // rule 1. have correct genesis block
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } =
        chain.at(i);
      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      //rule 2. lastHash should be correct for each block
      if (lastHash !== currentLastHash) return false;

      //defence against difficulty attack
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      //rule 3. check that block is valid
      const validHash = createHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validHash) return false;
    }

    return true;
  }


}
