import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.player.deleteMany();
  
  const data = fs.readFileSync(
    path.join(process.cwd(), 'data', 'top4scraped.txt'),
    'utf8'
  )

  const players = data
    .split('--------------------------------------------------------------------------------')
    .map(block => block.trim())
    .filter(block => block.length > 0)
    .map(block => JSON.parse(block))

  for (const player of players) {
    await prisma.player.create({
      data: {
        ...player,
        updatedAt: new Date()
      }
    })
  }

  console.log(`Database has been seeded with ${players.length} players`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })