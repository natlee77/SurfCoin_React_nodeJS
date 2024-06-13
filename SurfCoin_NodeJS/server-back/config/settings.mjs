const INITIAL_DIFFICULTY = 3;

export const MINE_RATE = 1000;


export const GENESIS_DATA = {
  timestamp: Date.now(),
  blockIndex: 0,
  lastHash: '0',
  hash: '0',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [], 
  transactions: []
};
