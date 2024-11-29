import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const info = async (req: any, res: any) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      name: true,
      photo: true,
      id: true,
    },
  });
  return res.json({
    user,
  });
};
export const allItems = async (req: any, res: any) => {
  try {
    const items = await prisma.auctionItems.findMany({
      orderBy: {
        deadline: "asc",
      },
      select: {
        id: true, // Select only the 'id' of the auction item
        name: true, // Select only the 'name' of the auction item
        startingPrice: true, // Select starting price
        deadline: true, // Select deadline
        status: true, // Select status
        photo: true, // Select photo
        user: {
          // Select related user data with specific fields
          select: {
            id: true, // Select only the 'id' of the user
            name: true, // Select only the 'name' of the user
            email: true,
            photo: true, // Select only the 'email' of the user
          },
        },
      },
    });

    res.json({
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
