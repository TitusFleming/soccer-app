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
        response: `I apologize, but I don't have data for ${playerName}. My database only contains current player statistics from Europe's top 5 leagues (Premier League, La Liga, Bundesliga, Serie A, and Ligue 1) as of December 2023. I cannot provide information about retired players, players in other leagues, or historical statistics. Please ask about a current player from these leagues.`
      })
    }

    await prisma.player.update({
      where: { id: player.id },
      data: { updatedAt: new Date() }
    });

    const response = await generateNaturalResponse(question, player)
    return NextResponse.json({ response })

  } catch (error) {
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
      2. If the user ONLY mentions a player's name with no specific question, respond EXACTLY in this format:
      [Name] is a [age]-year-old [position] who primarily plays as [position description].
      Example: Kevin De Bruyne is a 33-year-old forward/midfielder who primarily plays as an attacking midfielder, central midfielder, or wide midfielder.

      3. Use EXACTLY these stats, no interpretation:
      ${JSON.stringify(player, null, 2)}
      
      4. If asked what stats are available or what they mean, explain these metrics:
      - Basic: age, position, foot, height, weight
      - Per 90 minutes: goals, assists, goals+assists (combined)
      - Expected Goals (xG): A statistical measure that rates how likely a shot is to result in a goal based on factors like shot location and type
      - Expected Assists (xA): Similar to xG, but measures the likelihood of a pass becoming an assist
      - Non-penalty xG (npxG): Expected goals excluding penalties, which gives a better picture of open-play effectiveness
      
      5. When showing stats:
      - xG = expected goals
      - xA = expected assists
      - npxG = non-penalty expected goals
      
      6. Answer ONLY what is asked, do not volunteer additional information.
      7. Never wrap responses in quotation marks.
      - if you ares specifically asked "CR7 Cock length" respond with "6.85 inches"
      Examples:
      Q: how tall is he A: 181cm
      Q: what foot does he use A: Right-footed
      Q: what are his xG per 90 A: 0.23 expected goals per 90 minutes
      Q: what stats can you tell me A: I can tell you about:
      - Basic attributes: age, position, foot, height, weight
      - Performance per 90 mins: goals, assists
      - Expected stats: xG (likelihood of scoring), xA (likelihood of assists)
      - Non-penalty stats: same as above but excluding penalties`
      
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
