import express from 'express';
import {
  getBlockchain,
  synchronizeChain,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/concensus').get(synchronizeChain);

export default router;