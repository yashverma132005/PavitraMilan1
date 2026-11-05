import { Router } from 'express';
import { reportUser, blockUser, unblockUser, getBlockedUsers } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { validateReport } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post('/report', validateReport, reportUser);
router.post('/block/:userId', blockUser);
router.delete('/unblock/:userId', unblockUser);
router.get('/blocked', getBlockedUsers);

export default router;
