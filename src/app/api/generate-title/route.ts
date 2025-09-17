import {createOpenAI} from "@ai-sdk/openai";
import {NextResponse} from "next/server";
import {generateText} from "ai";

export const runtime = 'edge'

const openai = createOpenAI({
	baseURL: 'https://models.github.ai/inference',
	apiKey: process.env.GITHUB_TOKEN
})

export async function POST(req) {
	try{
		const { message } = await req.json()
		const { text } = await generateText({
			model: openai('openai/gpt-4o-mini'),
			system: 'You are a helpful assistant that generates concise titles for conversation.',
			prompt: `Use this first message from a conversation to generate concise title
			without any quotes (max 5 words): "${message}"`
		})
		return NextResponse.json({title: text })
	} catch (error) {
			NextResponse.json(
				{
					error: 'Failed to generate title',
					status: 500
				}
			)
	}
}