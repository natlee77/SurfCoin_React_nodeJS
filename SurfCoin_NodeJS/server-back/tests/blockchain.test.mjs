import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Blockchain', () => {
    let blockchain, blockchain2, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
        originalChain = blockchain.chain.slice();  // make a copy of the original chain
      });

  it('should have property chain', () => {
    expect(blockchain).toHaveProperty('chain');
  });

  it('should start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis);
  });
  it('should add a new block to the chain', () => {
    const data = 'foo';
    blockchain.addBlock({ data: data });
    expect(blockchain.chain.at(-1).data).toEqual(data);
  });

  describe('validity', () => {
    describe('if it starts with the failure genesis block', () => {
      it('should return false', () => {
        blockchain.chain[0] = { data: 'fake-genesis-data' };
        expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
      });
    });

    describe('if the chain contains a few blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'Bears' });
        blockchain.addBlock({ data: 'Beets' });
        blockchain.addBlock({ data: 'Battlestar Galactica' });
      });

      describe('and a lastHash reference has changed', () => {
        it('should return false', () => {
          blockchain.chain[1].lastHash = 'wrong-lastHash';
          expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
        });

        describe('and the block has an invalid data', () => {
          it('should return false', () => {
            blockchain.chain[2].data = 'some-fake-data';
            expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
          });
        });

        describe('and the chain is valid', () => {
          it('should return true', () => {
            expect(Blockchain.validateChain(blockchain.chain)).toBe(true);
          });
        });

        describe('and the chain contains a block with a jumped difficulty jump', () => {
          it('should return false', () => {
            const lastBlock = blockchain.chain.at(-1);
            const lastHash = lastBlock.hash;
            const timestamp = Date.now();
            const nonce = 0;
            const data = [];
            const difficulty = lastBlock.difficulty - 4;

            const hash = createHash(
              timestamp,
              lastHash,
              data,
              difficulty,
              nonce
            );
            const block = new Block({
              timestamp,
              lastHash,
              hash,
              data,
              difficulty,
              nonce,
            });

            blockchain.chain.push(block);
            expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
          });
        });
      });
    });
  });

  describe('replaceChain', () => {
    describe('when the new chain is shorter', () => {
      it('should not replace the chain', () => {
        blockchain2.chain[0] = { info: 'info' };
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        blockchain2.addBlock({ data: 'Bears' });
        blockchain2.addBlock({ data: 'Beets' });
        blockchain2.addBlock({ data: 'Battlestar Galactica' });
      });

      describe('and the chain is invalid', () => {
        it('should not replace the chain', () => {
          blockchain2.chain[1].hash = 'some-fake-hash';
          blockchain.replaceChain(blockchain2.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe('and the chain is valid', () => {
        it('should replace the chain', () => {
          blockchain.replaceChain(blockchain2.chain);
          expect(blockchain.chain).toBe(blockchain2.chain);
        });
      });
    });
  });
});