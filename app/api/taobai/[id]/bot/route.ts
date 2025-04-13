import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/utils/googleAI";

export async function POST(request: NextRequest) {
	const { _class, subject, prompt } = await request.json();

	const fixedPrompt = _class.reduce(
		(acc: string, curr: string, index: number) => {
			return `${acc}${index > 0 ? "\n" : ""}Set ${index + 1}: Class ${curr} - Subject: ${subject[index]} - Prompt: ${prompt[index]}`;
		},
		"",
	);
	await generateText(fixedPrompt);

	return NextResponse.json(true);
}
