import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

/**
 * SQLite stores arrays as JSON strings.
 * This helper converts arrays/values to a JSON string or null.
 */
const stringifyField = (val) => {
  if (val === undefined || val === null) return null;
  if (Array.isArray(val)) return val.length > 0 ? JSON.stringify(val) : null;
  return typeof val === 'string' ? val : JSON.stringify(val);
};

export const createProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existingProfile = await prisma.profile.findUnique({ where: { userId } });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists. Use PUT to update.',
      });
    }

    const {
      fullName, gender, dateOfBirth, birthTime, maritalStatus,
      height, weight, bloodGroup, city, state, country, aboutMe, expectations,
      highestQualification, college, occupation, companyName, annualIncome, workLocation,
      fatherName, fatherOccupation, motherName, motherOccupation,
      brothers, sisters, familyType, familyStatus,
      religion, caste, subCaste, gotra, manglikStatus, motherTongue,
      birthPlace, diet, smoking, drinking, hobbies,
      partnerPreference,
      phone,
    } = req.body;

    const profileData = {
      userId,
      fullName,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      birthTime,
      maritalStatus,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      bloodGroup,
      city,
      state,
      country: country || 'India',
      aboutMe,
      expectations,
      highestQualification,
      college,
      occupation,
      companyName,
      annualIncome,
      workLocation,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      brothers: brothers ? parseInt(brothers) : 0,
      sisters: sisters ? parseInt(sisters) : 0,
      familyType,
      familyStatus,
      religion,
      caste,
      subCaste,
      gotra,
      manglikStatus,
      motherTongue,
      birthPlace,
      diet,
      smoking,
      drinking,
      hobbies: hobbies ? (typeof hobbies === 'string' ? hobbies : JSON.stringify(hobbies)) : null,
    };

    const createData = { ...profileData };

    if (partnerPreference) {
      createData.partnerPreference = {
        create: {
          ageMin: partnerPreference.ageMin || 21,
          ageMax: partnerPreference.ageMax || 35,
          heightMin: partnerPreference.heightMin ? parseFloat(partnerPreference.heightMin) : null,
          heightMax: partnerPreference.heightMax ? parseFloat(partnerPreference.heightMax) : null,
          education: stringifyField(partnerPreference.education),
          occupation: stringifyField(partnerPreference.occupation),
          locations: stringifyField(partnerPreference.locations),
          religions: stringifyField(partnerPreference.religions),
          castes: stringifyField(partnerPreference.castes),
          otherExpectations: partnerPreference.otherExpectations || null,
        },
      };
    }

    const profile = await prisma.profile.create({
      data: createData,
      include: { partnerPreference: true },
    });

    const userUpdateData = { isProfileComplete: true };
    if (phone !== undefined) {
      userUpdateData.phone = phone && typeof phone === 'string' && phone.trim() ? phone.trim() : null;
    }

    await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: {
        ...profile,
        phone: userUpdateData.phone || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
      include: { partnerPreference: true },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Create one first.',
      });
    }

    const { partnerPreference, phone, ...profileFields } = req.body;

    let updatedPhone = undefined;
    if (phone !== undefined) {
      updatedPhone = phone && typeof phone === 'string' && phone.trim() ? phone.trim() : null;
      await prisma.user.update({
        where: { id: userId },
        data: { phone: updatedPhone },
      });
    }

    // Clean up numeric fields
    if (profileFields.height) profileFields.height = parseFloat(profileFields.height);
    if (profileFields.weight) profileFields.weight = parseFloat(profileFields.weight);
    if (profileFields.brothers) profileFields.brothers = parseInt(profileFields.brothers);
    if (profileFields.sisters) profileFields.sisters = parseInt(profileFields.sisters);
    if (profileFields.dateOfBirth) profileFields.dateOfBirth = new Date(profileFields.dateOfBirth);

    const updateData = { ...profileFields };

    if (partnerPreference) {
      // Serialize array fields for SQLite
      const prefData = {
        ...partnerPreference,
        heightMin: partnerPreference.heightMin ? parseFloat(partnerPreference.heightMin) : undefined,
        heightMax: partnerPreference.heightMax ? parseFloat(partnerPreference.heightMax) : undefined,
      };
      if (partnerPreference.education !== undefined) prefData.education = stringifyField(partnerPreference.education);
      if (partnerPreference.occupation !== undefined) prefData.occupation = stringifyField(partnerPreference.occupation);
      if (partnerPreference.locations !== undefined) prefData.locations = stringifyField(partnerPreference.locations);
      if (partnerPreference.religions !== undefined) prefData.religions = stringifyField(partnerPreference.religions);
      if (partnerPreference.castes !== undefined) prefData.castes = stringifyField(partnerPreference.castes);

      if (existingProfile.partnerPreference) {
        updateData.partnerPreference = {
          update: prefData,
        };
      } else {
        updateData.partnerPreference = {
          create: {
            ageMin: prefData.ageMin || 21,
            ageMax: prefData.ageMax || 35,
            heightMin: prefData.heightMin || null,
            heightMax: prefData.heightMax || null,
            education: stringifyField(partnerPreference.education),
            occupation: stringifyField(partnerPreference.occupation),
            locations: stringifyField(partnerPreference.locations),
            religions: stringifyField(partnerPreference.religions),
            castes: stringifyField(partnerPreference.castes),
            otherExpectations: partnerPreference.otherExpectations || null,
          },
        };
      }
    }

    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData,
      include: { partnerPreference: true },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...profile,
        // The phone is already available from the authenticated user (or the
        // value just persisted above); avoid an extra database read after the
        // profile update has committed.
        phone: updatedPhone !== undefined ? updatedPhone : req.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        partnerPreference: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...profile,
        phone: profile.user?.phone || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the requester is blocked by the profile owner or has blocked them
    const blocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: id, blockedId: req.user.id },
          { blockerId: req.user.id, blockedId: id },
        ],
      },
    });

    if (blocked) {
      return res.status(403).json({
        success: false,
        message: 'Unable to view this profile',
      });
    }

    const profile = await prisma.profile.findFirst({
      where: {
        OR: [
          { id },
          { userId: id },
        ],
      },
      include: {
        partnerPreference: true,
        user: {
          select: {
            id: true,
            phone: true,
            isActive: true,
            lastLogin: true,
          },
        },
      },
    });

    if (!profile || !profile.user?.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Check if requester and profile owner are mutually matched OR viewing own profile
    const isSelf = profile.userId === req.user.id;
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: profile.userId },
          { user1Id: profile.userId, user2Id: req.user.id },
        ],
      },
    });

    // Check if requester has already sent an interest/request to this profile
    const sentInterest = await prisma.interest.findFirst({
      where: {
        senderId: req.user.id,
        receiverId: profile.userId,
      },
    });

    const isMatched = !!match;
    const hasSentInterest = !!sentInterest;

    const responseData = {
      ...profile,
      isMatched,
      hasSentInterest,
      phone: (isMatched || isSelf) ? profile.user?.phone || null : null,
      user: {
        id: profile.user.id,
        isActive: profile.user.isActive,
        lastLogin: profile.user.lastLogin,
      },
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const take = 8;

    // Get blocked user IDs
    const blockedRelations = await prisma.blockedUser.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
      select: { blockerId: true, blockedId: true },
    });

    const blockedUserIds = new Set();
    blockedRelations.forEach((b) => {
      blockedUserIds.add(b.blockerId);
      blockedUserIds.add(b.blockedId);
    });
    blockedUserIds.delete(userId);

    const requesterProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { gender: true },
    });

    if (!requesterProfile?.gender) {
      return res.status(404).json({
        success: false,
        message: 'Complete your profile to receive recommendations',
      });
    }

    const targetGender = requesterProfile.gender.toUpperCase() === 'FEMALE' ? 'MALE' : 'FEMALE';
    const where = {
      userId: { not: userId, notIn: Array.from(blockedUserIds) },
      user: { isActive: true },
      gender: targetGender,
    };

    const profiles = await prisma.profile.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            lastLogin: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const [blockedRelations, requesterProfile] = await Promise.all([
      prisma.blockedUser.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      }),
      prisma.profile.findUnique({ where: { userId }, select: { gender: true } }),
    ]);

    const blockedUserIds = new Set();
    blockedRelations.forEach(({ blockerId, blockedId }) => {
      blockedUserIds.add(blockerId);
      blockedUserIds.add(blockedId);
    });
    blockedUserIds.delete(userId);

    const where = {
      userId: { not: userId, notIn: [...blockedUserIds] },
      user: { isActive: true },
    };

    if (requesterProfile?.gender) {
      where.gender = requesterProfile.gender.toUpperCase() === 'FEMALE' ? 'MALE' : 'FEMALE';
    }

    const { ageMin, ageMax, city, religion, maritalStatus, education } = req.query;
    if (city) where.city = { contains: String(city).trim() };
    if (religion) where.religion = { contains: String(religion).trim() };
    if (maritalStatus) where.maritalStatus = String(maritalStatus);
    if (education) where.highestQualification = { contains: String(education).trim() };

    const now = new Date();
    const dateOfBirth = {};
    const minAgeValue = Number.parseInt(ageMin, 10);
    const maxAgeValue = Number.parseInt(ageMax, 10);
    if (Number.isFinite(maxAgeValue)) {
      dateOfBirth.gte = new Date(now.getFullYear() - maxAgeValue - 1, now.getMonth(), now.getDate());
    }
    if (Number.isFinite(minAgeValue)) {
      dateOfBirth.lte = new Date(now.getFullYear() - minAgeValue, now.getMonth(), now.getDate());
    }
    if (Object.keys(dateOfBirth).length) where.dateOfBirth = dateOfBirth;

    const sortBy = ['newest', 'ageAsc', 'ageDesc', 'nameAsc'].includes(req.query.sortBy)
      ? req.query.sortBy
      : 'newest';
    const orderBy = sortBy === 'ageAsc'
      ? { dateOfBirth: 'desc' }
      : sortBy === 'ageDesc'
        ? { dateOfBirth: 'asc' }
        : sortBy === 'nameAsc'
          ? { fullName: 'asc' }
          : { createdAt: 'desc' };

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { user: { select: { id: true, lastLogin: true } } },
      }),
      prisma.profile.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: profiles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const hasValidCloudinary =
      process.env.CLOUDINARY_API_KEY &&
      !process.env.CLOUDINARY_API_KEY.startsWith('your-') &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
      !process.env.CLOUDINARY_CLOUD_NAME.startsWith('your-') &&
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_API_SECRET.startsWith('your-');

    if (!hasValidCloudinary) {
      return res.status(503).json({ success: false, message: 'Photo storage is not configured' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'pavitramilan/profiles',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, uploaded) => error ? reject(error) : resolve(uploaded)
      );
      uploadStream.end(req.file.buffer);
    });
    const photoUrl = result.secure_url;

    const { type } = req.query; // 'profile' or 'additional'
    const userId = req.user.id;

    if (type === 'profile') {
      await prisma.profile.update({
        where: { userId },
        data: { profilePhoto: photoUrl },
      });
    } else {
      const profile = await prisma.profile.findUnique({ where: { userId } });
      if (profile) {
        let photos = [];
        try {
          photos = profile.additionalPhotos ? JSON.parse(profile.additionalPhotos) : [];
        } catch { photos = []; }
        photos.push(photoUrl);
        await prisma.profile.update({
          where: { userId },
          data: {
            additionalPhotos: JSON.stringify(photos),
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: { url: photoUrl },
    });
  } catch (error) {
    next(error);
  }
};
