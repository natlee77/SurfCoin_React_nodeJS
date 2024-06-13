import { it, describe, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';
import { GENESIS_DATA, MINE_RATE } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import hexToBinary from 'hex-to-binary';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = '0';
  const hash = '0';
  const nonce = 1;
  const difficulty = 1;
  const data = { amount: 5, sender: 'abc', recipient: 'def' };

  const block = new Block({
    timestamp: timestamp,
    lastHash: lastHash,
    hash: hash,
    data: data,
    difficulty: difficulty,
    nonce: nonce,
  });

  describe('Properties and values', () => {
    // test that properties exist
    it('should have the properties timestamp, lastHash, hash, nonce, difficulty, data', () => {
      expect(block).toHaveProperty('timestamp');
      expect(block).toHaveProperty('lastHash');
      expect(block).toHaveProperty('hash');
      expect(block).toHaveProperty('nonce');
      expect(block).toHaveProperty('difficulty');
      expect(block).toHaveProperty('data');
    });
    // test that values are correct
    it('should have a value for each property', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.lastHash).toEqual(lastHash);
      expect(block.hash).toEqual(hash);
      expect(block.nonce).toEqual(nonce);
      expect(block.difficulty).toEqual(difficulty);
      expect(block.data).toEqual(data);
    });
  });

  describe('Genesis Block', () => {
    const genesis = Block.genesis;

    it('should return the Block instance', () => {
      expect(genesis).toBeInstanceOf(Block);
    });

    it('should return the genesis data', () => {
      expect(genesis).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock()', () => {
    let lastBlock, minedBlock, data;

    beforeEach(() => {
      lastBlock = Block.genesis;
      data = { message: 'foo' };
      minedBlock = Block.mineBlock({ lastBlock, data });
    });

    it('should return a Block instance', () => {
      expect(minedBlock).toBeInstanceOf(Block);
    });

    it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toBe(undefined);
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('should produce a hash based on correct inputs', () => {
        expect(minedBlock.hash).toEqual(
          createHash(
            minedBlock.timestamp,
            minedBlock.lastHash,
            minedBlock.difficulty,
            minedBlock.nonce,
            data
          )
        );
      });
  });

  describe('Difficulty adjustment', () => {
    it('should raise difficulty for quickly mined blocks', () => {
      expect(
        Block.adjustDifficultyLevel({
          block: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it('should lower difficulty for slowly mined blocks', () => {
      expect(
        Block.adjustDifficultyLevel({
          block: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });
  });
});
