// Centralized type definitions for the lambai feature

export interface AnswerBlock {
	id: string; // Unique ID for React keys or database use
	type: "text" | "latex";
	content: string;
}

// --- LINT FIX START: Define more specific types ---
export interface QuestionStructure {
	de_bai: string;
	// bai_lam is usually added during processing/output, not part of the initial structure
}

export interface OriginalContent {
	de_bai: string;
	// Allows keys like "cau_a", "cau_b" whose values are QuestionStructure
	// Uses index signature, assumes other keys follow this pattern.
	[key: string]: string | QuestionStructure;
}

export interface FormattedOutput {
	de_bai: string;
	// Allows keys like "cau_a", "cau_b" whose values are the final {de_bai, bai_lam} object
	[key: string]: string | { de_bai: string; bai_lam: string };
}
// --- LINT FIX END ---

// Add other shared types here as needed

export interface QuestionDetail {
	id: number; // Giữ lại id nếu cần, hoặc dùng index
	subQuestion: string; // Nội dung câu hỏi phụ (a, b, c, d)
	userAnswer: string;
	correctAnswer: string; // Đáp án đúng
	isCorrect: boolean;
}

export interface ResultData {
	correctAnswers: number;
	totalQuestions: number;
	percentage: number;
	completionTime: string;
	de_bai: string; // Đề bài chung
	questions: QuestionDetail[];
}
