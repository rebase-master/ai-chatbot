import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openai = createOpenAI({
	baseURL: 'https://models.github.ai/inference',
	apiKey: process.env.GITHUB_TOKEN,
});

export async function GET() {
	try {
		const { text } = await generateText({
			model: openai.chat('openai/gpt-4o-mini'),
			system: 'You are a helpful AI assistant named "Billu"',
			prompt: "Give a brief introduction of yourself",
		});

		return NextResponse.json({ message: text });
	} catch (error) {
		console.error("Error in test route: ", error);
		return NextResponse.json(
			{
				error: "An error occurred while processing your request",
				status: 500,
			},
			{ status: 500 }
		);
	}
}
