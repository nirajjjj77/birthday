import { NextRequest, NextResponse } from "next/server";
import { togetherai } from "@ai-sdk/togetherai";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { text } = await generateText({
      model: togetherai("meta-llama/Meta-Llama-3-1.8B-Instruct-Turbo"),
      prompt: prompt,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Error generating text" }, { status: 500 });
  }
}

 
