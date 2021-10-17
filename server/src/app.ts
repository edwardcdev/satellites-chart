import 'dotenv/config';
import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { logger, stream } from './utils/logger';
import validateEnv from './utils/validateEnv';
import errorMiddleware from './middlewares/error';
import routes from './routes';

validateEnv();

const app: Express = express();
const port: string | number = process.env.PORT || 7000;
const env: string = process.env.NODE_ENV || 'development';

if (env === 'production') {
  app.use(morgan('combined', { stream }));
  app.use(cors({ origin: 'http://20.80.240.57', credentials: true }));
} else if (env === 'development') {
  app.use(morgan('dev', { stream }));
  app.use(cors({ origin: true, credentials: true }));
}

app.use(hpp());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./build'));

routes.forEach((route: Router) => {
  app.use('/api/', route);
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve('./build/' + 'index.html'));
});

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`App listening on the port ${port}`);
});
