import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MSSQL_HOST: str(),
    MSSQL_USERNAME: str(),
    MSSQL_PASSWORD: str(),
    MSSQL_DATABASE: str(),
    MSSQL_PRO_DATABASE: str(),
  });
};

export default validateEnv;
