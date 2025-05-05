// utils/latexParser.ts

export interface ParsedBlock {
	type: "text" | "latex";
	content: string;
}

/**
 * Phân tích một chuỗi chứa văn bản và LaTeX inline ($...$) thành một mảng các khối.
 * Ví dụ: "Text $x^2$ more text" ->
 * [
 *   { type: "text", content: "Text " },
 *   { type: "latex", content: "x^2" },
 *   { type: "text", content: " more text" }
 * ]
 *
 * @param input Chuỗi đầu vào.
 * @returns Một mảng các đối tượng ParsedBlock.
 */
export function latexParser(input: string | null | undefined): ParsedBlock[] {
	if (!input) {
		return [];
	}

	// Regex để tìm các đoạn $...$ (non-greedy), thay . bằng [\s\S] để không cần flag 's'
	const regex = /([\s\S]*?)\$([\s\S]*?)\$/g;
	const result: ParsedBlock[] = [];
	let lastIndex = 0;
	let match;

	while ((match = regex.exec(input)) !== null) {
		// Phần text trước dấu $
		if (match[1]) {
			result.push({ type: "text", content: match[1] });
		}
		// Phần LaTeX bên trong $...$
		if (match[2]) {
			result.push({ type: "latex", content: match[2] });
		}
		lastIndex = regex.lastIndex;
	}

	// Phần text còn lại sau dấu $ cuối cùng (hoặc toàn bộ chuỗi nếu không có $)
	if (lastIndex < input.length) {
		result.push({ type: "text", content: input.substring(lastIndex) });
	}

	// Lọc bỏ các khối text rỗng không cần thiết
	return result.filter(
		(block) => !(block.type === "text" && block.content === ""),
	);
}
