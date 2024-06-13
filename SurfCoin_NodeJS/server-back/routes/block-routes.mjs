import express from 'express';
import { mineBlock, getBlockByIndex } from '../controllers/block-controller.mjs';

const router = express.Router();

router.route('/mine').post(mineBlock);
router.route ('/:blockIndex').get(getBlockByIndex);
export default router;