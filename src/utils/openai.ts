import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeQuestion(question: string): Promise<string | null> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a helpful assistant that extracts soccer player names from questions. 
        If you find a player name, nickname, or partial name, return ONLY their name.
        Be flexible with naming formats and capitalization.
        Common examples:
        - KDB, De Bruyne, Kevin -> Kevin De Bruyne
        - VVD, Van Dijk -> Virgil van Dijk
        - Messi, Leo Messi -> Lionel Messi
        - Palmer, Cole -> Cole Palmer
        
        If the input is not about a soccer player or no player is mentioned, return null.
        Always prefer matching a player name if possible, even with partial matches.`
      },
      {
        role: "user",
        content: question
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0,
    });

    const content = response.choices[0].message.content;
    if (!content || content === 'UNKNOWN' || content === 'null') {
      return null;
    }
    
    return content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
