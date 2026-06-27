const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.create({
    data: { email: 'admin@docassign.com', password: hashed, role: 'ADMIN' }
  })
  console.log('Admin created:', user.email)
  await prisma.$disconnect()
}

main()