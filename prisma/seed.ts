import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@ointjoyalaw.com"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN" },
    create: {
      email,
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin user ready:", admin.email)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })