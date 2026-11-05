import prisma from '../config/db.js';

export const sendInterest = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const { message } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send interest to yourself',
      });
    }

    // Check if receiver exists and is active
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, isActive: true },
    });

    if (!receiver || !receiver.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if blocked
    const blocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: senderId },
        ],
      },
    });

    if (blocked) {
      return res.status(403).json({
        success: false,
        message: 'Unable to send interest to this user',
      });
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (existingInterest) {
      return res.status(409).json({
        success: false,
        message: 'Interest already sent to this user',
      });
    }

    const interest = await prisma.interest.create({
      data: {
        senderId,
        receiverId,
        message,
      },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: { fullName: true, profilePhoto: true, city: true },
            },
          },
        },
      },
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Interest Received',
        message: `${interest.sender.profile?.fullName || 'Someone'} has sent you an interest`,
        type: 'interest',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Interest sent successfully',
      data: interest,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInterest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { interestId } = req.params;

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found',
      });
    }

    if (interest.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this interest',
      });
    }

    if (interest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Interest has already been ${interest.status.toLowerCase()}`,
      });
    }

    const [user1Id, user2Id] = [interest.senderId, interest.receiverId].sort();
    const { updatedInterest, match } = await prisma.$transaction(async (tx) => {
      const accepted = await tx.interest.updateMany({
        where: { id: interestId, receiverId: userId, status: 'PENDING' },
        data: { status: 'ACCEPTED' },
      });
      if (accepted.count !== 1) {
        const error = new Error('This interest has already been handled');
        error.statusCode = 409;
        throw error;
      }

      const updatedInterest = await tx.interest.findUnique({ where: { id: interestId } });
      const match = await tx.match.upsert({
        where: { user1Id_user2Id: { user1Id, user2Id } },
        create: { user1Id, user2Id },
        update: {},
      });
      await tx.notification.create({
        data: {
          userId: interest.senderId,
          title: 'Interest Accepted!',
          message: 'Your interest was accepted. You can now contact each other on WhatsApp.',
          type: 'match',
        },
      });
      return { updatedInterest, match };
    });

    res.status(200).json({
      success: true,
      message: 'Interest accepted. You are now matched!',
      data: { interest: updatedInterest, match },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectInterest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { interestId } = req.params;

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found',
      });
    }

    if (interest.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this interest',
      });
    }

    if (interest.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Interest has already been ${interest.status.toLowerCase()}`,
      });
    }

    const updatedInterest = await prisma.interest.update({
      where: { id: interestId },
      data: { status: 'REJECTED' },
    });

    res.status(200).json({
      success: true,
      message: 'Interest rejected',
      data: updatedInterest,
    });
  } catch (error) {
    next(error);
  }
};

export const getSentInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [interests, total] = await Promise.all([
      prisma.interest.findMany({
        where: { senderId: userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          receiver: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                  profilePhoto: true,
                  city: true,
                  gender: true,
                  dateOfBirth: true,
                  occupation: true,
                },
              },
            },
          },
        },
      }),
      prisma.interest.count({ where: { senderId: userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: interests,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReceivedInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [interests, total] = await Promise.all([
      prisma.interest.findMany({
        where: { receiverId: userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                  profilePhoto: true,
                  city: true,
                  gender: true,
                  dateOfBirth: true,
                  occupation: true,
                },
              },
            },
          },
        },
      }),
      prisma.interest.count({ where: { receiverId: userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: interests,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};
