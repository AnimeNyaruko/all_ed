import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});

export const generateText = async (
	prompt: string,
	systemInstruction?: string,
) => {
	const response = await genai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: [
			{
				role: "A teacher of highschool has knowledge of physics, chemistry, math, biology",
				text: prompt,
			},
		],
		config: {
			temperature: 0,
			systemInstruction: systemInstruction ?? "",
		},
	});
	console.log(response.candidates?.[0]?.content);
	return response.text;
};
