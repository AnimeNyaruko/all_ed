import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});

export const generateText = async (prompt: string) => {
	const response = await genai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: [
			{
				text: prompt,
			},
		],
	});
	return response.text;
};
