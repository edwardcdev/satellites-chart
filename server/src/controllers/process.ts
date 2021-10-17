import { Response, Request } from 'express';
import multer from 'multer';
import { IResult } from 'mssql';
import { connection } from './connection';
import upload from '../utils/upload';
import IFile from '../types/file';
import Client from '../types/client';

let clients: Client[] = [];
let files: IFile[] = [];

export const getSystems = async (req: Request, res: Response): Promise<void> => {
  const sql: string = `select distinct SYSTEM_VERSION_ID as SYSTEM_ID, NAME as SYSTEM_NAME from SYSTEM_VERSION`;

  connection
    .connect()
    .then(async () => {
      const result: IResult<any> = await connection.query(sql);
      const data = result.recordset;
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const getVersions = async (req: Request, res: Response): Promise<void> => {
  const { system_id, system_name } = req.query;
  const sql: string = `select SYSTEM_VERSION from SYSTEM_VERSION \
    where SYSTEM_VERSION_ID=${system_id} and NAME='${system_name}'`;

  connection
    .connect()
    .then(async () => {
      const result: IResult<any> = await connection.query(sql);
      const data = result.recordset;
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const getAttrVersions = async (req: Request, res: Response): Promise<void> => {
  const { system, version } = req.query;
  const sql: string = `select distinct SYSTEM_ATTRIBUTE_VERSION_ID from File_ID_USAT \
    where SYSTEM_ID=${system} and SYSTEM_VERSION_ID=${version}`;

  connection
    .connect()
    .then(async () => {
      const result: IResult<any> = await connection.query(sql);
      const data = result.recordset;
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const getModels = async (req: Request, res: Response): Promise<void> => {
  const { system } = req.query;
  const sql: string = `select distinct MODEL_ID, BEAM_TYPE_STK from STKMODEL_ATTRIBUTE where system_ID=${system}`;

  connection
    .connect()
    .then(async () => {
      const result: IResult<any> = await connection.query(sql);
      const data = result.recordset;
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const getBeams = async (req: Request, res: Response): Promise<void> => {
  const sql: string = `select distinct BEAM_TYPE_STK from STKMODEL_ATTRIBUTE`;

  connection
    .connect()
    .then(async () => {
      const result: IResult<any> = await connection.query(sql);
      const data = result.recordset;
      res.status(200).json(data);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const processing = async (req: Request, res: Response): Promise<void> => {
  let status: number = 200;
  upload('./assets/', 'upload')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) status = 500;
    //@ts-ignore
    files = req.files.map((item: any) => {
      return { name: item.originalname, size: item.size, status };
    });
  });

  clients.forEach((c: Client) => c.res.write(`data: ${JSON.stringify(files)}\n\n`));
  res.status(500).send({ message: status });

  // TODO: running python scripts files.
  // for (let i = 0; i < files.length; i++) {
  //   try {
  //     const { spawn } = require('child_process');
  //     const fileName = files[i].split('.')[0];
  //     var child = await spawn('python', [`${process.cwd()}/src/controllers/scripts/gap_data_v1.py`, fileName, 'xlsx']);

  //     child.stdout.on('data', function (data: any) {
  //       // res.status(200).send(data.toString());
  //       console.log(data.toString());
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
};
