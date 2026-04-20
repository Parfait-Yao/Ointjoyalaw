const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT enum_range(NULL::"PaymentMethod")`
    console.log('Enum values in DB:', result)
  } catch (e) {
    console.error('Error checking enum:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
