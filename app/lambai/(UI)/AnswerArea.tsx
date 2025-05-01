"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import "katex/dist/katex.min.css";
import {
	$getRoot,
	EditorState,
	LexicalEditor,
	LexicalNode,
	ElementNode,
	TextNode,
} from "lexical";
import { useMathLiveManager } from "./editor/hooks/useMathLiveManager";
import QuestionEditorInstance from "./editor/components/QuestionEditorInstance";

// Custom Node
import { LatexNode, $isLatexNode } from "./editor/nodes/LatexNode";

// Type definitions remain the same
declare global {
	namespace JSX {
		interface IntrinsicElements {
			"math-field": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & {
					value?: string;
					readonly?: boolean;
					style?: React.CSSProperties;
					onInput?: (event: Event) => void;
					onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
					"virtual-keyboard-mode"?: string;
					id?: string;
				},
				HTMLElement
			>;
		}
	}
	interface Window {
		MathfieldElement: MathfieldElement;
	}
}

// Define a basic interface for the Mathfield element we interact with
interface MathfieldElement {
	// Or choose a more specific name if preferred
	value: string;
	focus(): void;
	select(): void;
}

interface AnswerBlock {
	id: string; // Add unique ID for React keys
	type: "text" | "latex";
	content: string;
}

interface AnswerAreaProps {
	questions: Record<string, string>;
	onAnswersChange: (answers: Record<string, AnswerBlock[]>) => void; // Expect AnswerBlock array
}

// Example Lexical Theme (Customize as needed)
const editorTheme = {
	ltr: "ltr",
	rtl: "rtl",
	paragraph: "mb-1",
	text: {
		bold: "font-bold",
		italic: "italic",
		underline: "underline",
		strikethrough: "line-through",
		underlineStrikethrough: "underline line-through",
		code: "bg-gray-100 text-gray-800 p-1 rounded text-sm font-mono",
	},
	latex: "latex-node-class", // Add class for custom styling of LatexNode span
};

// Function to handle editor errors
function onError(error: Error) {
	console.error(error);
}

// Function to convert Lexical state to AnswerBlock[] (Improved Typing)
function lexicalStateToAnswerBlocks(editorState: EditorState): AnswerBlock[] {
	const blocks: AnswerBlock[] = [];
	editorState.read(() => {
		const root = $getRoot();
		root.getChildren().forEach((paragraph: LexicalNode) => {
			// Ensure it's an element node that can have children (like ParagraphNode)
			if (paragraph instanceof ElementNode) {
				let currentText = "";
				paragraph.getChildren().forEach((node: LexicalNode) => {
					if (node instanceof TextNode) {
						// Use instanceof for type checking
						currentText += node.getTextContent();
					} else if ($isLatexNode(node)) {
						// Use type guard
						if (currentText) {
							blocks.push({
								// Keep using Math.random() for text blocks to maintain existing behavior
								id: `text-${Math.random()}`,
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
					// Keep using Math.random() for trailing text blocks
					blocks.push({
						id: `text-${Math.random()}`,
						type: "text",
						content: currentText,
					});
				}
			}
		});
	});
	return blocks;
}

// Wrap the component with React.memo
const AnswerArea = memo(({ questions, onAnswersChange }: AnswerAreaProps) => {
	const [isClient, setIsClient] = useState(false);
	const [isCortexLoaded, setIsCortexLoaded] = useState(false);
	const editorRefMap = useRef<Record<string, LexicalEditor | null>>({});
	const mathLiveManager = useMathLiveManager({ editorRefMap });
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout

	// Load CortexJS script
	useEffect(() => {
		let script: HTMLScriptElement | null = null;
		if (typeof window !== "undefined" && !customElements.get("math-field")) {
			script = document.createElement("script");
			script.src = "https://unpkg.com/mathlive?module";
			script.type = "module";
			script.async = true;
			script.onload = () => {
				setIsCortexLoaded(true);
				// console.log("CortexJS/MathLive loaded.");
			};
			// script.onerror = () => console.error("Failed to load CortexJS/MathLive.");
			document.body.appendChild(script);
		}

		// Enhanced Cleanup Function
		return () => {
			// Check if the script exists and is still a child of the body
			if (script && document.body.contains(script)) {
				try {
					document.body.removeChild(script);
					//console.log("MathLive script removed."); // Optional: for debugging
				} catch (e) {
					console.error("Error removing MathLive script:", e);
				}
			}
		};
	}, []);

	// Ensure Lexical only renders on the client
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Debounced handler using setTimeout
	const handleEditorChangeDebounced = useCallback(
		(key: string, editorState: EditorState, editor: LexicalEditor) => {
			editorRefMap.current[key] = editor; // Update editor ref immediately

			// Clear previous timeout if exists
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}

			// Set new timeout
			debounceTimeoutRef.current = setTimeout(() => {
				const blocks = lexicalStateToAnswerBlocks(editorState);
				onAnswersChange({ [key]: blocks });
			}, 500); // 500ms delay
		},
		[onAnswersChange], // Dependency remains the same
	);

	// Effect to clear timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, []);

	if (!isClient) {
		return null; // Don't render SSR
	}

	return (
		<div className="space-y-6">
			{Object.entries(questions).map(([key, question]) => {
				// Define initialConfig for each editor instance
				const initialConfig = {
					namespace: `AnswerEditor-${key}`,
					theme: editorTheme,
					onError,
					nodes: [LatexNode], // Still need to register the node
				};

				// Render the QuestionEditorInstance component
				return (
					<QuestionEditorInstance
						key={key} // Use question key for React key
						questionKey={key}
						questionContent={question}
						initialConfig={initialConfig}
						triggerMathfieldFunc={mathLiveManager.triggerMathfield}
						debouncedOnAnswersChange={handleEditorChangeDebounced}
						// Pass down state and handlers from the hook
						isLatexInputVisible={mathLiveManager.isLatexInputVisible}
						currentLatexValue={mathLiveManager.currentLatexValue}
						editingNodeKey={mathLiveManager.editingNodeKey}
						activeEditorKey={mathLiveManager.activeEditorKey}
						activeMathLiveKey={mathLiveManager.activeMathLiveKey}
						handleMathfieldInput={mathLiveManager.handleMathfieldInput}
						handleMathfieldKeyDown={mathLiveManager.handleMathfieldKeyDown}
						isCortexLoaded={isCortexLoaded}
					/>
				);
			})}
		</div>
	);
});

AnswerArea.displayName = "AnswerArea"; // Add display name

export default AnswerArea; // Export the memoized component
