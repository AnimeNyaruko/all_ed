import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	ParagraphNode,
	RootNode,
} from "lexical";
import { $createLatexNode, LatexNode } from "../nodes/LatexNode"; // Giả sử đường dẫn này đúng
import type { AnswerBlock } from "@/types"; // Import kiểu AnswerBlock

interface InitialContentPluginProps {
	initialContent?: AnswerBlock[];
}

function InitialContentPlugin({
	initialContent,
}: InitialContentPluginProps): null {
	const [editor] = useLexicalComposerContext();
	const isInitialized = useRef(false); // Ref để đánh dấu đã khởi tạo chưa

	useEffect(() => {
		// Chỉ chạy nếu có editor, có initialContent, và chưa được khởi tạo
		if (
			editor &&
			initialContent &&
			initialContent.length > 0 &&
			!isInitialized.current
		) {
			editor.update(() => {
				try {
					const root = $getRoot();
					root.clear(); // Xóa nội dung cũ (nếu có)

					let currentParagraph: ParagraphNode | null = null;

					initialContent.forEach((block) => {
						if (block.type === "text" && block.content === "\n") {
							// Nếu gặp newline, kết thúc đoạn hiện tại (nếu có) và chuẩn bị tạo đoạn mới
							// Đảm bảo đoạn hiện tại được thêm vào root nếu chưa
							if (currentParagraph) {
								root.append(currentParagraph);
							}
							currentParagraph = null; // Reset để đoạn sau sẽ tạo mới
						} else {
							// Nếu không phải newline, đảm bảo có đoạn hiện tại để thêm vào
							if (!currentParagraph) {
								currentParagraph = $createParagraphNode();
							}

							if (block.type === "text") {
								// Thêm TextNode vào đoạn hiện tại
								currentParagraph.append($createTextNode(block.content));
							} else if (block.type === "latex") {
								// Thêm LatexNode vào đoạn hiện tại
								currentParagraph.append($createLatexNode(block.content));
							}
						}
					});

					// Thêm đoạn cuối cùng vào root nếu còn
					if (currentParagraph) {
						root.append(currentParagraph);
					}

					// Di chuyển con trỏ đến cuối sau khi thiết lập nội dung
					if (root.getChildrenSize() > 0) {
						const lastNode = root.getLastDescendant();
						if (lastNode) {
							lastNode.selectEnd();
						} else {
							// Fallback nếu không có nút nào được thêm
							root.selectEnd();
						}
					} else {
						// Nếu root trống (ví dụ initialContent chỉ có '\n'), tạo một đoạn trống
						if (root.getChildrenSize() === 0) {
							root.append($createParagraphNode());
						}
						root.selectEnd();
					}

					isInitialized.current = true; // Đánh dấu đã khởi tạo
				} catch (error) {
					console.error("Error setting initial editor content:", error);
					// Ngăn chặn việc đánh dấu đã khởi tạo nếu có lỗi
				}
			});
		}
		// Dependency array: Chỉ chạy lại khi editor thay đổi hoặc initialContent thay đổi
		// Tuy nhiên, logic isInitialized.current sẽ ngăn nó chạy lại sau lần thành công đầu tiên.
	}, [editor, initialContent]);

	return null; // Plugin không render gì cả
}

export default InitialContentPlugin;
