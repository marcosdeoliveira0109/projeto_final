import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Registo das rotas da API com o prefixo /api
app.use('/api', routes);
app.use(errorHandler);

export default app;
