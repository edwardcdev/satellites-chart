import { Response } from 'express';

interface Client {
  id: number;
  res: Response<any>;
}

export default Client;
