import { Response, Request } from 'express';
import connect from '../database';

const { MSSQL_DATABASE, MSSQL_PRO_DATABASE } = process.env;

let connection = connect();

const changeDB = async (req: Request, res: Response): Promise<void> => {
  const { database } = req.query;
  connection = connect(database === 'product_db' ? MSSQL_PRO_DATABASE : MSSQL_DATABASE);
  res.status(200).send({ message: 'success' });
};

export { connection, changeDB };
