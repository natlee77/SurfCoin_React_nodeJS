import express from 'express';
import { broadcastTransaction, createTransaction } from '../controllers/transaction-controller.mjs';
const router = express.Router();

router.route('/transaction').post(createTransaction);
router.route('/transaction/broadcast').post(broadcastTransaction);

export default router;