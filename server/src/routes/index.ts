import { Router } from 'express';
import caesar from './caesar';
import process from './process';
import connection from './connection';

const routes: Router[] = [caesar, process, connection];

export default routes;
