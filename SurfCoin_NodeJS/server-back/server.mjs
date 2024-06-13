import express from 'express';

import blockchainRouter from './routes/blockchain-routes.mjs';
import blockRouter from './routes/block-routes.mjs';
import memberRouter from './routes/member-routes.mjs';
import transactionRoutes from './routes/transaction-route.mjs';
import cors from 'cors';

import ErrorResponse from './utilities/ErrorResponseModel.mjs';
import logger from './middleware/logger.mjs';
import errorHandler from './middleware/errorHandler.mjs';

import path from 'path';
import { fileURLToPath } from 'url';

//export blockchain to be used in other files in the project (controllers)

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

global.__appdir = dirname;

app.use(cors());
app.use(express.json());

app.use(logger)

//1. flexible port number p.1
const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;
let NODE_PORT;

// 3. block and blockchain routes
app.use('/api/v1/block', blockRouter);
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/transactions', transactionRoutes);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

//2. flexible port number p.2
if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
