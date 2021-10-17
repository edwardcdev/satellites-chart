import { Router } from 'express';
import { changeDB } from '../controllers/connection';

const router: Router = Router();

router.get('/change-db', changeDB);

export default router;
