import { PrismaClient } from '@prisma/client'
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

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { question } = await request.json()
   
  try {
    const playerName = await analyzeQuestion(question)
    
    if (!playerName && (
      question.toLowerCase().includes('he') || 
      question.toLowerCase().includes('his') ||
      question.toLowerCase().includes('him')
    )) {
      const lastPlayer = await prisma.player.findFirst({
        orderBy: { updatedAt: 'desc' }
      });
      if (lastPlayer) {
        const response = await generateNaturalResponse(question, lastPlayer);
        return NextResponse.json({ response });
      }
    }

    if (!playerName) {
      return NextResponse.json({ 
        response: "I can only help you with questions about soccer players. What player would you like to know about?"
      })
    }

    const player = await prisma.player.findFirst({
      where: {
        OR: [
          { name: { equals: playerName, mode: 'insensitive' } },
          { name: { contains: playerName, mode: 'insensitive' } },
          { name: { contains: playerName.split(' ')[0], mode: 'insensitive' } },
          { name: { contains: playerName.split(' ').slice(-1)[0], mode: 'insensitive' } },
        ]
      }
    })

    if (!player) {
      return NextResponse.json({ 
        response: `I don't have any data for ${playerName} in my database. Please ask about another player.`
      })
    }

    await prisma.player.update({
      where: { id: player.id },
      data: { updatedAt: new Date() }
    });

    const response = await generateNaturalResponse(question, player)
    return NextResponse.json({ response })

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      response: error instanceof Error ? error.message : "Failed to process request"
    });
  }
}

async function generateNaturalResponse(question: string, player: Player): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: "You are a helpful assistant that answers questions about soccer players using their statistics. Keep responses concise and natural."
    },
    {
      role: "user",
      content: `Player data: ${JSON.stringify(player)}\nQuestion: ${question}`
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
  });

  return response.choices[0].message.content || "I couldn't generate a response.";
}
