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
        content: `You are a helpful assistant that analyzes soccer questions.
        If a question is about a specific player's stats, return ONLY their name.
        If the question is about general soccer information (like where a player plays), return "GENERAL_SOCCER_QUESTION".
        If the input is not about soccer at all, return null.`
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
    if (!content || content === 'null') {
      return null;
    }
    
    return content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
