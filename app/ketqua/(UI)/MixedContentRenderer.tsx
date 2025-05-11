"use client";

import React from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css"; // Import KaTeX CSS

// Import ParsedBlock from utils
import type { ParsedBlock } from "@/utils/latexParser";

// Định nghĩa lại kiểu ParsedBlock ở đây hoặc import từ utils nếu muốn chia sẻ
/* // Removed: type is now imported
interface ParsedBlock {
	type: "text" | "latex";
	content: string;
}
*/

interface MixedContentRendererProps {
	data: ParsedBlock[];
	className?: string; // Optional className for the container
}

const MixedContentRenderer: React.FC<MixedContentRendererProps> = ({
	data,
	className = "",
}) => {
	if (!data || data.length === 0) {
		return null;
	}

	// Tạo key ổn định hơn nếu có thể, index là phương án dự phòng
	let keyCounter = 0;

	return (
		<div className={`mixed-content-renderer ${className}`}>
			{data.map((block) => {
				const key = `${block.type}-${keyCounter++}`; // Key tạm thời dựa trên index
				if (block.type === "latex") {
					return <InlineMath key={key} math={block.content} />;
				} else {
					// Render text, có thể cần xử lý xuống dòng nếu text chứa \n
					// Giữ lại khoảng trắng để hiển thị đúng - use CSS class
					return (
						<span key={key} className="whitespace-pre-line">
							{block.content}
						</span>
					);
				}
			})}
		</div>
	);
};

export default MixedContentRenderer;
