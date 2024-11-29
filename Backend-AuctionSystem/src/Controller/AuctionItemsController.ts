import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const addItems = async (req: any, res: any) => {
  console.log(req.body);

  const {
    name,
    description,
    createdAt,
    deadline,
    userId,
    status,

    startingPrice,
  } = req.body;
  const uploadedFile = req?.file;
  try {
    const newItem = await Prisma.auctionItems.create({
      data: {
        name,
        description,
        createdAt,
        deadline,
        userId: Number(userId),
        status,
        photo: uploadedFile?.path,
        startingPrice: Number(startingPrice),
      },
    });
    res.json({
      status: "success",
      newItem,
    });
  } catch (err) {
    res.json({
      status: "Failure",
    });
  }
};
export const itemInfo = async function (req: any, res: any) {
  const { id } = req.body;

  try {
    const item = await Prisma.auctionItems.findFirst({
      where: {
        id, // Find the item by its unique ID
      },
      select: {
        name: true,
        description: true,
        photo: true,
        status: true,
        startingPrice: true,
        deadline: true,
        user: {
          select: {
            name: true,
            photo: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
