import { Router } from 'express';
import multer from 'multer';
import {
  createProfile,
  updateProfile,
  getProfile,
  getProfileById,
  getRecommendedProfiles,
  searchProfiles,
  uploadPhoto,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import { validateProfileCreate, validateProfileUpdate } from '../middleware/validate.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.use(protect);

router.post('/', validateProfileCreate, createProfile);
router.put('/', validateProfileUpdate, updateProfile);
router.get('/me', getProfile);
router.get('/recommendations', getRecommendedProfiles);
router.get('/search', searchProfiles);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.get('/:id', getProfileById);

export default router;
