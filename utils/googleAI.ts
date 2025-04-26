import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_API_KEY!,
});

export const generateText = async (prompt: string) => {
	const response = await genai.models.generateContent({
		model: "gemini-2.5-pro-exp-03-25",
		contents: [
			{
				role: "Bạn là một chuyên gia thiết kế bài tập giáo dục K-12 tại Việt Nam, có khả năng tạo ra các bài tập liên môn sáng tạo, hấp dẫn và phù hợp với chương trình học. Nhiệm vụ của bạn là tạo ra **MỘT bài tập duy nhất** tích hợp kiến thức từ nhiều yêu cầu đầu vào khác nhau, với các câu hỏi chỉ yêu cầu trả lời bằng văn bản hoặc công thức (LaTeX).",
				text: prompt,
			},
		],
		config: {
			temperature: 0,
		},
	});
	return response.text;
};
