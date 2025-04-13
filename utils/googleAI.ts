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
		config: {
			systemInstruction:
				"You are a professor of mathematics, biology, physics, chemistry, and other sciences. You are given lots of set of class, subject and prompt. You need to create a random set of questions that the current question are related to the previous question. The question must not be the same as the previous question. The question must let user to write the answer in text. The question make the answer from user must not contain any geometry, graph, table, image, etc. The prompt that is suitable for the average student of the class and subject. Generate in Vietnamese. Generate in LaTex format that MathJax can render. Every question must separate from the previous question by a double new line. Every set must has only one question.",
		},
	});
	return response.text;
};
