import { Response, Request } from 'express';
import { IResult } from 'mssql';
import { connection } from './connection';
import { getAvgs } from '../utils/util';
import { testData, cartData } from '../data/test';
import IFile from '../types/file';
import Client from '../types/client';

let clients: Client[] = [];
let files: IFile[] = [];

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { spawn } = require('child_process');
    var child = await spawn('python', [
      `${process.cwd()}/src/controllers/scripts/gap_data_v1.py`,
      req.query.selected,
      'csv'
    ]);

    child.stdout.on('data', function (data: any) {
      res.status(200).send(data.toString());
    });
  } catch (error) {
    throw error;
  }
};

export const getPlotItems = async (req: Request, res: Response): Promise<void> => {
  let result: any = [];

  try {
    const { spawn } = require('child_process');
    var child = await spawn('python', [
      `${process.cwd()}/src/controllers/scripts/plot_data_v1.py`,
      JSON.stringify(testData)
    ]);

    child.stderr.on('data', (data: any) => {
      console.log(data.toString());
    });

    child.stdout.on('data', (data: any) => {
      result += data.toString();
    });

    child.on('exit', (code: any) => {
      console.log(`process has finished and exited with code: ${code}`);
      res.status(200).send({ heatmap: testData, intrpl: JSON.parse(result) });
    });
  } catch (error) {
    throw error;
  }
};

export const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const { system, version, dataType } = req.query;
  const query: string = dataType === 'coverage' ? 's.[Percent Coverage]' : '100 - s.[Percent Coverage]';
  const sql: string = `SELECT DISTINCT f.[FILE_ID] as file_id, f.[User Altitude] as altitude, f.[User Inclination] as inclination, \
    ${query} as value FROM FILE_ID_USAT as f INNER JOIN StkReportSummaryStats as s \
    ON f.FILE_ID=s.FILE_ID WHERE system_id=${system} AND f.Is_Active=1 AND f.SYSTEM_ATTRIBUTE_VERSION_ID=${version} \
    ORDER BY altitude, inclination, value, file_id`;

  if (system && version) {
    let result2: any = {};
    let tdata: any = cartData;

    connection
      .connect()
      .then(async () => {
        const result: IResult<any> = await connection.query(sql);
        const data = result.recordset;

        tdata['label'] = dataType === 'coverage' ? 'Coverage (%)' : 'No Coverage (%)';
        tdata['plot_value'] = data;
        result2['terrestrial'] = testData;
        result2['data'] = tdata;

        res.status(200).send(result2);
      })
      .catch((err: Error) => {
        throw err;
      });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  const { dataType, fileId } = req.body;
  // TODO: Need to account for case where there are more than 2 file IDs

  const sql =
    fileId.length === 1
      ? `SELECT s.[Simulation Time] as simulation_time, s.[Gap Duration] as gap_duration FROM StkReport as s \
    INNER JOIN FILE_ID_USAT as f ON f.[FILE_ID]=s.[FILE_ID] \
    WHERE f.Is_Active=1 AND f.FILE_ID=${fileId[0].FILE_ID} \
    ORDER BY s.[Simulation Time]`
      : `SELECT s.[Simulation Time] as simulation_time, s.[Gap Duration] as gap_duration FROM StkReport as s \
    INNER JOIN FILE_ID_USAT as f ON s.FILE_ID=f.FILE_ID WHERE f.FILE_ID=${fileId[0].FILE_ID} OR \
    f.FILE_ID=${fileId[1].FILE_ID} AND f.Is_Active=1 \
    ORDER BY simulation_time`;
  let preVal: number = 0;
  let tdata: number[] = [];
  let result2: any = {};

  connection
    .connect()
    .then(async () => {
      let result: IResult<any>;
      result = await connection.query(sql);
      const data = result.recordset;

      if (dataType === 'coverage') {
        let fVal: number = parseFloat(data[0].simulation_time);
        data.map((item: any) => {
          if (Number(item.gap_duration)) {
            let pVal = preVal - fVal;
            fVal = parseFloat(item.simulation_time);
            tdata.push(pVal);
          }
          preVal = parseFloat(item.simulation_time);
        });

        result2['coverage'] = {
          data: getAvgs(tdata),
          title: 'Coverage Running Average',
          type: 'line'
        };
        result2['coverage_histogram'] = {
          data: tdata,
          title: 'Coverage Distribution',
          type: 'histogram'
        };
      } else {
        let tdata = data.map((item: any) => {
          return Number(item.gap_duration);
        });

        result2['gap'] = {
          data: getAvgs(tdata),
          title: 'Gaps Running Average',
          type: 'line'
        };
        result2['gap_histogram'] = {
          data: tdata,
          title: 'Gaps Distribution',
          type: 'histogram'
        };
      }

      res.status(200).json(result2);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const getSystems = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'select distinct SYSTEM_VERSION_ID as system_id, NAME as system_name from SYSTEM_VERSION';

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
  } catch (error) {
    throw error;
  }
};

export const getVersions = async (req: Request, res: Response): Promise<void> => {
  const { system } = req.body;
  const sql = `select distinct SYSTEM_ID, SYSTEM_ATTRIBUTE_VERSION_ID as versions from FILE_ID_USAT where SYSTEM_ID=${system}`;

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

export const getFileId = async (req: Request, res: Response): Promise<void> => {
  const { user_altitude, user_inclination, system, version } = req.query;
  const sql = `SELECT FILE_ID FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} AND \
      [User Altitude]=${user_altitude} AND [User Inclination]=${user_inclination} AND Is_Active=1`;

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

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify(files)}\n\n`;
  res.write(data);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    files = [];
    clients = clients.filter((c) => c.id !== clientId);
  });
};

export const deleteRecord = async (req: Request, res: Response): Promise<void> => {
  const { system, version, alt, inc, fileId } = req.body;
  let sqls: string[] = [];

  sqls.push(`DELETE FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} \
    AND [User Altitude]=${alt} AND [User Inclination]=${inc} AND Is_Active=1 AND FILE_ID=${fileId[1].FILE_ID}`);
  sqls.push(`DELETE FROM StkReport WHERE FILE_ID=${fileId[1].FILE_ID} AND Is_Active=1`);
  sqls.push(`DELETE FROM StkReportSummaryStats WHERE FILE_ID=${fileId[1].FILE_ID} AND Is_Active=1`);
  sqls.push(`DELETE FROM StkPointingReportSummaryStats WHERE FILE_ID=${fileId[1].FILE_ID} AND Is_Active=1`);

  connection
    .connect()
    .then(async () => {
      for (let i = 0; i < sqls.length; i++) {
        await connection.query(sqls[i]);
      }
      res.status(200).send('success');
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const deleteAll = async (req: Request, res: Response): Promise<void> => {
  const { system, version } = req.body;
  let sqls: string[] = [];

  sqls.push(`DELETE FROM StkReport WHERE FILE_ID IN \
      (SELECT FILE_ID FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} AND Is_Active=1)`);
  sqls.push(`DELETE FROM StkReportSummaryStats WHERE FILE_ID IN \
      (SELECT FILE_ID FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} AND Is_Active=1)`);
  sqls.push(`DELETE FROM StkPointingReportSummaryStats WHERE FILE_ID IN \
      (SELECT FILE_ID FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} AND Is_Active=1)`);
  sqls.push(
    `DELETE FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} AND Is_Active=1`
  );

  connection
    .connect()
    .then(async () => {
      for (let i = 0; i < sqls.length; i++) {
        await connection.query(sqls[i]);
      }
      res.status(200).send('success');
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const migrate = async (req: Request, res: Response): Promise<void> => {
  const { system, version, alt, inc, fildId } = req.body;
  const sql = `SELECT * FROM FILE_ID_USAT WHERE SYSTEM_ID=${system} AND SYSTEM_ATTRIBUTE_VERSION_ID=${version} \
    AND [User Altitude]=${alt} AND [User Inclination]=${inc} AND Is_Active=1 AND FILE_ID=${
    JSON.parse(fildId[0]).FILE_ID
  }; \
    SELECT * FROM StkReport WHERE FILE_ID=${JSON.parse(fildId[0].FILE_ID)}`;

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

export const createSystem = async (req: Request, res: Response): Promise<void> => {
  const { system } = req.body;
  let sqls: string[] = [];

  sqls.push(`insert into SYSTEM_VERSION( SYSTEM_VERSION_ID, SYSTEM_VERSION, NAME) values(\
    (select max(SYSTEM_VERSION_ID)+1  from SYSTEM_VERSION), 0, '${system}')`);
  sqls.push(
    `insert into STKMODEL_ATTRIBUTE(MODEL_ID, SYSTEM_ID) values(0, (select max(SYSTEM_VERSION_ID) from SYSTEM_VERSION))`
  );

  connection
    .connect()
    .then(async () => {
      for (let i = 0; i < sqls.length; i++) {
        try {
          await connection.query(sqls[i]);
        } catch (err) {
          throw err;
        }
      }
      res.status(200).send('success');
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const createVersion = async (req: Request, res: Response): Promise<void> => {
  const { system_id, system_name } = req.body;
  let sqls: string[] = [];

  sqls.push(`insert into SYSTEM_VERSION( SYSTEM_VERSION_ID, SYSTEM_VERSION, NAME) \
    values(${system_id}, (select max(SYSTEM_VERSION)+1  from SYSTEM_VERSION \
    where SYSTEM_VERSION_ID=${system_id}), '${system_name}')`);
  sqls.push(`delete from SYSTEM_VERSION where SYSTEM_VERSION=0`);

  connection
    .connect()
    .then(async () => {
      for (let i = 0; i < sqls.length; i++) {
        try {
          await connection.query(sqls[i]);
        } catch (err) {
          throw err;
        }
      }
      res.status(200).send('success');
    })
    .catch((err: Error) => {
      throw err;
    });
};

export const createModel = async (req: Request, res: Response): Promise<void> => {
  const { system_id, beam } = req.body;
  let sqls: string[] = [];

  sqls.push(`insert into STKMODEL_ATTRIBUTE(MODEL_ID, SYSTEM_ID, BEAM_TYPE_STK) \
    values((select max(MODEL_ID)+1 from STKMODEL_ATTRIBUTE \
    where SYSTEM_ID=${system_id}), '${system_id}', '${beam.trim()}')`);
  sqls.push(`delete from SYSTEM_VERSION where SYSTEM_VERSION=0`);

  connection
    .connect()
    .then(async () => {
      for (let i = 0; i < sqls.length; i++) {
        try {
          await connection.query(sqls[i]);
        } catch (err) {
          throw err;
        }
      }
      res.status(200).send('success');
    })
    .catch((err: Error) => {
      throw err;
    });
};
