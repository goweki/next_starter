// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// view seeded
async function retrieveDBdata() {
  // Queries
  const users = await prisma.user.findMany();
  // MPs
  console.log("Total MPs:", users);
}

retrieveDBdata()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
