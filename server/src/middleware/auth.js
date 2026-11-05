import { getAuth } from '@clerk/express';
import prisma from '../config/db.js';

/**
 * Clerk-based auth middleware.
 * Verifies the Clerk session token, then finds or creates the local DB user.
 */
export const protect = async (req, res, next) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no valid session',
      });
    }

    // Look up the local user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileComplete: true,
      },
    });

    // Auto-sync: if user doesn't exist locally yet, create them
    if (!user) {
      // Fetch full user details from Clerk backend API
      const { clerkClient } = await import('@clerk/express');
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      const primaryEmail = clerkUser.emailAddresses?.find(
        ({ id }) => id === clerkUser.primaryEmailAddressId
      ) || clerkUser.emailAddresses?.[0];
      const primaryPhone = clerkUser.phoneNumbers?.find(
        ({ id }) => id === clerkUser.primaryPhoneNumberId
      ) || clerkUser.phoneNumbers?.[0];
      const email = primaryEmail?.emailAddress;
      const phone = primaryPhone?.phoneNumber || null;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Clerk account has no email address',
        });
      }

      // Check if a user with this email already exists (from legacy sign-up)
      const existingByEmail = await prisma.user.findUnique({ where: { email } });

      if (existingByEmail) {
        // Link the existing user to the Clerk account
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            clerkId: clerkUserId,
            isEmailVerified: primaryEmail?.verification?.status === 'verified',
            isPhoneVerified: primaryPhone?.verification?.status === 'verified',
            lastLogin: new Date(),
          },
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            isProfileComplete: true,
          },
        });
      } else {
        // Create a brand-new local user
        user = await prisma.user.create({
          data: {
            email,
            clerkId: clerkUserId,
            phone,
            isEmailVerified: primaryEmail?.verification?.status === 'verified',
            isPhoneVerified: primaryPhone?.verification?.status === 'verified',
            lastLogin: new Date(),
          },
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            isProfileComplete: true,
          },
        });
      }
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
};
