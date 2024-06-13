import { blockchain, redisServer } from '../startup.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import ErrorResponseModel from '../utilities/ErrorResponseModel.mjs';

//1.  Controller function to handle the mining of a new block
export const mineBlock = (req, res, next) => {
  const data   = req.body;
  const block = blockchain.addBlock({data:data});

  // Broadcast the new block to all member nodes
  redisServer.broadcastBlockchain();

  // Create a reward transaction for mining the new block
  const rewardTransaction = {
    amount: 3,
    sender: '0000',
    recipient: blockchain.nodeUrl,
  };

  // Add and broadcast the reward transaction
  blockchain.addTransaction(rewardTransaction);
  redisServer.broadcastTransaction(rewardTransaction);

  res.status(201).json( new ResponseModel({
    success: true,
    statusCode: 201,
    data: { block },
  }));
};

// 2. Controller function to get a block by its index
export const getBlockByIndex = (req, res, next) => {
  const blockIndex = parseInt(req.params.blockIndex);
  const adjustedIndex = blockIndex - 1;
  if (adjustedIndex >= 0 && adjustedIndex < blockchain.chain.length) {
    const block = blockchain.chain[adjustedIndex];
    res.status(200).json(new ResponseModel({ statusCode: 200, data: block }));
  } else {
    res
      .status(404)
      .json(new ErrorResponseModel({ statusCode: 404, error: 'Block not found' }));
  }
};
 



