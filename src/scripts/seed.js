const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const super_admin = require("../scripts/data/super_admin.json");
const media = require("../scripts/data/media.json");

// funtion definition
async function seed() {
  console.log("Seeding super_admin...");
  await prisma.user.upsert({
    where: { email: super_admin.email },
    update: { ...super_admin },
    create: { ...super_admin },
  });

  console.log("Seeding media...");
  await prisma.media.createMany({
    data: media,
  });
}

//function call
seed()
  .then(async () => {
    console.log("SEEDING COMPLETE\n");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
