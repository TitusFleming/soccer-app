import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { analyzeQuestion } from '@/utils/openai'
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface Player {
  id: string;
  name: string;
  age?: number | null;
  position?: string | null;
  foot?: string | null;
  height?: string | null;
  weight?: string | null;
  goals_per90?: number | null;
  assists_per90?: number | null;
  goals_assists_per90?: number | null;
  goals_pens_per90?: number | null;
  goals_assists_pens_per90?: number | null;
  xg_per90?: number | null;
  xg_assist_per90?: number | null;
  xg_xg_assist_per90?: number | null;
  npxg_per90?: number | null;
  npxg_xg_assist_per90?: number | null;
  updatedAt: Date;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    const playerName = await analyzeQuestion(question)

    if (!playerName) {
      return NextResponse.json({
        response: "I couldn't identify a player name in your question. Please ask about a specific player's statistics."
      })
    }

    const player = await prisma.player.findFirst({
      where: {
        name: {
          contains: playerName,
          mode: 'insensitive'
        }
      }
    })

    if (!player) {
      return NextResponse.json({
        response: `I don't have data for ${playerName}. I only have current statistics for active players in Europe's top 5 leagues (Premier League, La Liga, Bundesliga, Serie A, and Ligue 1) as of December 2023. This means I cannot provide information about:
• Retired players (like Maradona, Pelé)
• Players in other leagues (MLS, Saudi Pro League, etc.)
• Historical statistics
• Players who transferred out of these leagues

Please ask about a current player from the top 5 European leagues.`
      })
    }

    await prisma.player.update({
      where: { id: player.id },
      data: { updatedAt: new Date() }
    });

    const response = await generateNaturalResponse(question, player)
    return NextResponse.json({ response })

  } catch (err) {
    console.error('Error processing request:', err)
    return NextResponse.json({
      response: "Sorry, there was an error processing your request. Please try again."
    })
  }
}

async function generateNaturalResponse(question: string, player: Player): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a soccer stats assistant. Follow these rules STRICTLY:
      1. Never use quotation marks in your responses.
      2. If asked about players not in the top 5 European leagues (like Ronaldo in Saudi Arabia or Messi in MLS), 
         answer their question but ALWAYS add: By the way, I have detailed statistics for current players in Europe's top 5 leagues (Premier League, La Liga, Bundesliga, Serie A, and Ligue 1). Feel free to ask about them!
      3. If the user ONLY mentions a player's name with no specific question, respond EXACTLY in this format:
         [Name] is a [age]-year-old [position] who primarily plays as [position description].
      4. Use EXACTLY these stats, no interpretation:
      ${JSON.stringify(player, null, 2)}
      
      5. If asked what stats are available or what they mean, explain these metrics:
      - Basic: age, position, foot, height, weight
      - Per 90 minutes: goals, assists, goals+assists (combined)
      - Expected Goals (xG): A statistical measure that rates how likely a shot is to result in a goal based on factors like shot location and type`
    },
    {
      role: "user",
      content: question
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.1,
  });

  return response.choices[0].message.content?.replace(/['"]/g, '') || 'Sorry, I could not generate a response.';
}
