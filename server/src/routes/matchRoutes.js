import { Router } from 'express';
import { getMatches } from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getMatches);

export default router;
