import { Router } from 'express';
import { getMe, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateUser);
router.delete('/me', deleteUser);

export default router;
