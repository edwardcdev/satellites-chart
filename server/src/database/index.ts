import sql from 'mssql';

const { MSSQL_HOST, MSSQL_USERNAME, MSSQL_PASSWORD, MSSQL_DATABASE } = process.env;

const connect = (db?: string) => {
  const config = {
    user: MSSQL_USERNAME ?? '',
    password: MSSQL_PASSWORD ?? '',
    server: MSSQL_HOST ?? '',
    database: db ?? MSSQL_DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true,
      enableArithAbort: true
    }
  };

  const connection = new sql.ConnectionPool(config);
  return connection;
};

export default connect;
