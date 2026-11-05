import prisma from '../config/db.js';

export const getMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user1: {
            select: {
              id: true,
              phone: true,
              lastLogin: true,
              profile: {
                select: {
                  fullName: true,
                  profilePhoto: true,
                  city: true,
                  gender: true,
                  dateOfBirth: true,
                  occupation: true,
                  highestQualification: true,
                },
              },
            },
          },
          user2: {
            select: {
              id: true,
              phone: true,
              lastLogin: true,
              profile: {
                select: {
                  fullName: true,
                  profilePhoto: true,
                  city: true,
                  gender: true,
                  dateOfBirth: true,
                  occupation: true,
                  highestQualification: true,
                },
              },
            },
          },
        },
      }),
      prisma.match.count({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
      }),
    ]);

    // Transform matches to show the other user
    const transformedMatches = matches.map((match) => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      return {
        matchId: match.id,
        matchedAt: match.createdAt,
        user: otherUser,
      };
    });

    res.status(200).json({
      success: true,
      data: transformedMatches,
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
