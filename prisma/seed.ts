import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@ointjoyalaw.com" },
    update: { password: hashedPassword, role: "ADMIN" },
    create: {
      email: "admin@ointjoyalaw.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin user ready:", admin.email)
  console.log("   Email    : admin@ointjoyalaw.com")
  console.log("   Password : admin123")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })