import {
	EditorState,
	$getRoot,
	LexicalNode,
	ElementNode,
	TextNode,
	LexicalEditor,
} from "lexical";
import { $isLatexNode, LatexNode } from "../nodes/LatexNode";
import type { AnswerBlock } from "@/types";

// Function to convert Lexical state to AnswerBlock[] (Improved Typing)
export function lexicalStateToAnswerBlocks(
	editorState: EditorState,
): AnswerBlock[] {
	const blocks: AnswerBlock[] = [];
	editorState.read(() => {
		const root = $getRoot();
		const rootChildren = root.getChildren();
		rootChildren.forEach((paragraph: LexicalNode, paragraphIndex: number) => {
			// Ensure it's an element node that can have children (like ParagraphNode)
			if (paragraph instanceof ElementNode) {
				let currentText = "";
				// Add nodeIndex for stable text block IDs
				paragraph
					.getChildren()
					.forEach((node: LexicalNode, nodeIndex: number) => {
						if (node instanceof TextNode) {
							// Use instanceof for type checking
							currentText += node.getTextContent();
						} else if ($isLatexNode(node)) {
							// Use type guard
							if (currentText) {
								blocks.push({
									// Use stable ID based on paragraph and node index
									id: `text-${paragraphIndex}-${nodeIndex - 1}`, // Use index of previous node
									type: "text",
									content: currentText,
								});
								currentText = "";
							}
							// Use the node's key for latex blocks
							blocks.push({
								id: node.getKey(),
								type: "latex",
								content: node.getLatex(),
							});
						}
					});
				if (currentText) {
					// Use stable ID for trailing text blocks
					blocks.push({
						// Use the index of the last node processed in the loop
						id: `text-${paragraphIndex}-${paragraph.getChildren().length - 1}`,
						type: "text",
						content: currentText,
					});
				}

				// Add newline block after processing each paragraph, except the last one
				if (paragraphIndex < rootChildren.length - 1) {
					// Ensure the paragraph wasn't completely empty (or handle as needed)
					// Optional: Check if the last added block was already a newline? (Probably not needed)
					blocks.push({
						id: `newline-${paragraphIndex}`,
						type: "text",
						content: "\n",
					});
				}
			}
		});
	});
	return blocks;
}
