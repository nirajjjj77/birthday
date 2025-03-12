import { NextResponse } from 'next/server';
import { togetherai } from '@ai-sdk/togetherai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Generate text using the AI model
    const { text } = await generateText({
      model: togetherai('meta-llama/Meta-Llama-3-1.8B-Instruct-Turbo'),
      prompt: prompt || 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating text' }, { status: 500 });
  }
}
 
