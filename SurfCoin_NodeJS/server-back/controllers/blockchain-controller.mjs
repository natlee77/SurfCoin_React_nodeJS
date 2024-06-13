import { blockchain } from '../startup.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import ErrorResponseModel from '../utilities/ErrorResponseModel.mjs';
import writeBlockchainToFile from '../utilities/fileHandler.mjs';

const getBlockchain = (req, res, next) => {
  res.status(200).json(new ResponseModel({ success: true, data: blockchain }));
};

const mineBlock = async (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  //proof of work to find a valid nonce, difficulty, and timestamp
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currentBlockHash,
    blockchain.pendingTransactions
  );
  // Generate the hash for the new block
  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
   // blockchain.pendingTransactions, // <-- array for att testa
    nonce,
    difficulty
  );
  // Create the new block
  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
   // blockchain.pendingTransactions, // <-- array for att testa
    currentBlockHash,
    nonce,
    difficulty
  );
 
  // Broadcast the new block to all member nodes using Redis
  redisServer.publish({
    channel: 'BLOCKCHAIN',
    message: JSON.stringify(block),
  });

    // Create a reward transaction for mining the new block
  const reward = { amount: 3, sender: '0000', recipient: blockchain.nodeUrl };
  // Broadcast the reward transaction to all member nodes using Redis
  redisServer.publish({
    channel: 'TRANSACTIONS',
    message: JSON.stringify(reward),
  });
  res.status(200).json( new ResponseModel({
    success: true,
    statusCode: 200,
    data: { message: 'Block skapat och distribuerat', block },
  }));


  // Write the blockchain to a file
  writeBlockchainToFile('blocks.json', blockchain.chain);
};


// Endpoint to update the blockchain with a new block
const updateChain = (req, res, next) => {
  const block = req.body.block;
  const lastBlock = blockchain.getLastBlock();
  const hash = lastBlock.currentBlockHash === block.previousBlockHash;
  const index = lastBlock.blockIndex + 1 === block.blockIndex;

  if (hash && index) {
    blockchain.chain.push(block);
    blockchain.pendingTransactions = [];

    res.status(201).json(new ResponseModel({
      success: true,
      statusCode: 201,
      data: {
        message: 'Blocket är tillagt och skickat till alla noder',
        block: block,
      },
    }));
  } else {
    res.status(500).json( new ErrorResponseModel({
      success: false,
      statusCode: 500,
      data: { message: 'Det nya blocket avvisades', block },
    }));
  }
};




// Consensus endpoint to synchronize the blockchain across all nodes
const synchronizeChain = (req, res, next) => {
  // Ta reda på aktuellt antal block i kedjan.
  const currentLength = blockchain.chain.length;
  let maxLength = currentLength;
  let longestChain = null;

  blockchain.memberNodes.forEach(async (member) => {
    const response = await fetch(`${member}/api/v1/blockchain`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chain.length > maxLength) {
        maxLength = result.data.chain.length;
        longestChain = result.data.chain;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log('Är synkade');
      } else {
        blockchain.chain = longestChain;
      }
    }
  });

  res.status(200).json(new ResponseModel({
    success: true,
    statusCode: 200,
    data: { message: 'Synkroniseringen är klar' },
  }));
};

export { mineBlock, getBlockchain, synchronizeChain, updateChain };
