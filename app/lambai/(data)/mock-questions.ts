import type { AnswerBlock } from "@/types";

export type QuestionType =
	| "multiple_choice"
	| "true_false"
	| "short_answer"
	| "essay";

export interface Question {
	id: string;
	type: QuestionType;
	content: string;
	options?: string[]; // For multiple_choice
	sub_questions?: string[]; // For true_false with sub-questions
}

export const mockQuestions: Question[] = [
	{
		id: "q1",
		type: "multiple_choice",
		content: "Trái Đất quay quanh Mặt Trời theo quỹ đạo hình gì?",
		options: ["Hình tròn", "Hình elip", "Hình vuông", "Hình tam giác"],
	},
	{
		id: "q2",
		type: "true_false",
		content:
			"Cho các phát biểu sau về tác phẩm 'Chí Phèo' của Nam Cao. Xác định tính đúng sai của từng phát biểu.",
		sub_questions: [
			"Thị Nở là người đã đánh thức bản tính lương thiện trong con người Chí Phèo.",
			"Bá Kiến là nhân vật đại diện cho tầng lớp nông dân bị áp bức.",
			"Chí Phèo đã giết Bá Kiến và sau đó tự kết liễu đời mình.",
			"Truyện kết thúc với hình ảnh một cái lò gạch cũ, mở ra tương lai cho một Chí Phèo con.",
		],
	},
	{
		id: "q3",
		type: "short_answer",
		content: "Thủ đô của nước Pháp là gì?",
	},
	{
		id: "q4",
		type: "essay",
		content: "Hãy phân tích những ảnh hưởng của biến đổi khí hậu đến Việt Nam.",
	},
	{
		id: "q5",
		type: "multiple_choice",
		content: "Kim loại nào dẫn điện tốt nhất?",
		options: ["Vàng", "Bạc", "Đồng", "Nhôm"],
	},
];

// We can also define a type for the answers state
export type Answer = string | boolean | AnswerBlock[] | Record<number, boolean>;

export type AnswersState = Record<string, Answer>; 