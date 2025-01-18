import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')
  
  // Clear existing data
  await prisma.player.deleteMany();
  console.log('Cleared existing data')
  
  try {
    const data = fs.readFileSync(
      path.join(process.cwd(), 'data', 'known_scope_data.txt'),
      'utf8'
    )

    // Split the data by the delimiter and parse each block
    const players = data
      .split('--------------------------------------------------------------------------------')
      .map(block => block.trim())
      .filter(block => block.length > 0)
      .map(block => {
        try {
          return JSON.parse(block)
        } catch (e) {
          console.error('Error parsing block:', block)
          throw e
        }
      })

    console.log(`Found ${players.length} players to seed`)

    for (const playerData of players) {
      // Clean position data by removing special characters
      const cleanPosition = playerData.position?.replace(/\u00a0|\u25aa/g, '').trim() || null

      await prisma.player.create({
        data: {
          name: playerData.name,
          age: playerData.age || null,
          position: cleanPosition,
          foot: playerData.foot || null,
          height: playerData.height || null,
          weight: playerData.weight || null,
          goals_per90: playerData.goals_per90 || null,
          assists_per90: playerData.assists_per90 || null,
          goals_assists_per90: playerData.goals_assists_per90 || null,
          goals_pens_per90: playerData.goals_pens_per90 || null,
          goals_assists_pens_per90: playerData.goals_assists_pens_per90 || null,
          xg_per90: playerData.xg_per90 || null,
          xg_assist_per90: playerData.xg_assist_per90 || null,
          xg_xg_assist_per90: playerData.xg_xg_assist_per90 || null,
          npxg_per90: playerData.npxg_per90 || null,
          npxg_xg_assist_per90: playerData.npxg_xg_assist_per90 || null,
          updatedAt: new Date()
        }
      })
      console.log(`Seeded player: ${playerData.name}`)
    }

    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })