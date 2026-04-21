
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import "dotenv/config"

async function test() {
  const connectionString = process.env.DATABASE_URL
  console.log("Connecting to:", connectionString?.split('@')[1]) // Log host only for safety
  
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const events = await prisma.event.findMany({ take: 1 })
    console.log("Success! Found events:", events.length)
    if (events.length > 0) {
      console.log("Column isFree exists and value is:", events[0].isFree)
    }
  } catch (err) {
    console.error("Failed to fetch events:", err)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

test()
