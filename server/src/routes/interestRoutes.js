import { Router } from 'express';
import {
  sendInterest,
  acceptInterest,
  rejectInterest,
  getSentInterests,
  getReceivedInterests,
} from '../controllers/interestController.js';
import { protect } from '../middleware/auth.js';
import { validateInterest } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post('/send/:receiverId', validateInterest, sendInterest);
router.put('/accept/:interestId', acceptInterest);
router.put('/reject/:interestId', rejectInterest);
router.get('/sent', getSentInterests);
router.get('/received', getReceivedInterests);

export default router;
