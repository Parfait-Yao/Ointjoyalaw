import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@ointjoyalaw.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email: "admin@ointjoyalaw.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log({ admin })
  console.log("Seed admin user created : admin@ointjoyalaw.com / admin123")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
