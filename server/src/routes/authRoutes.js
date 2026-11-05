import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import prisma from '../config/db.js';

const router = Router();

/**
 * GET /api/auth/me
 * Returns the authenticated user's data (Clerk-verified).
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileComplete: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        profile: {
          include: {
            partnerPreference: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
    });
  }
});

export default router;
