import prisma from '../config/db.js';

export const reportUser = async (req, res, next) => {
  try {
    const reporterId = req.user.id;
    const { reportedId, reason, description } = req.body;

    if (reporterId === reportedId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report yourself',
      });
    }

    const reportedUser = await prisma.user.findUnique({
      where: { id: reportedId },
      select: { id: true },
    });

    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedId,
        reason,
        description,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const blockerId = req.user.id;
    const { userId } = req.params;

    if (blockerId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block yourself',
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingBlock = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: { blockerId, blockedId: userId },
      },
    });

    if (existingBlock) {
      return res.status(409).json({
        success: false,
        message: 'User is already blocked',
      });
    }

    const block = await prisma.blockedUser.create({
      data: {
        blockerId,
        blockedId: userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User blocked successfully',
      data: block,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const blockerId = req.user.id;
    const { userId } = req.params;

    const block = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: { blockerId, blockedId: userId },
      },
    });

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'User is not blocked',
      });
    }

    await prisma.blockedUser.delete({
      where: { id: block.id },
    });

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getBlockedUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const blockedUsers = await prisma.blockedUser.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: blockedUsers,
    });
  } catch (error) {
    next(error);
  }
};
