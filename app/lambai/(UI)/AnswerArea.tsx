"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import "katex/dist/katex.min.css";
import { EditorState, LexicalEditor } from "lexical";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { useMathLiveManager } from "./editor/hooks/useMathLiveManager";
import QuestionEditorInstance from "./editor/components/QuestionEditorInstance";

// Custom Node
import { LatexNode, $isLatexNode } from "./editor/nodes/LatexNode";
import { lexicalStateToAnswerBlocks } from "./editor/utils/lexicalUtils";
import type { AnswerBlock } from "@/types";

interface AnswerAreaProps {
	questions: Record<string, string>;
	initialAnswers?: Record<string, AnswerBlock[]>;
	onAnswersChange: (answers: Record<string, AnswerBlock[]>) => void; // Expect AnswerBlock array
}

// Wrap the component with React.memo
const AnswerArea = memo(
	({ questions, initialAnswers, onAnswersChange }: AnswerAreaProps) => {
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
			latex: "latex-node-class",
		};

		function onError(error: Error) {
			console.error(error);
		}

		const [isClient, setIsClient] = useState(false);
		const [isCortexLoaded, setIsCortexLoaded] = useState(false);
		const editorRefMap = useRef<Record<string, LexicalEditor | null>>({});
		const mathLiveManager = useMathLiveManager({ editorRefMap });
		const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
					console.log("MathLive script loaded successfully."); // Add confirmation log
				};
				// Uncomment and improve onerror
				script.onerror = () =>
					console.error("Failed to load CortexJS/MathLive script.");
				document.body.appendChild(script);
			} else if (customElements.get("math-field")) {
				// If already loaded, set the state
				setIsCortexLoaded(true);
				console.log("MathLive custom element already registered.");
			}

			// Enhanced Cleanup Function
			return () => {
				// Check if the script exists and is still a child of the body
				if (script && document.body.contains(script)) {
					try {
						document.body.removeChild(script);
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
				{isClient &&
					Object.entries(questions).map(([key, questionText]) => {
						// Create Lexical config for each instance
						const initialConfig: InitialConfigType = {
							namespace: `QuestionEditor-${key}`,
							theme: editorTheme,
							onError: onError,
							nodes: [LatexNode],
							editorState: null, // Set initial state if needed, e.g., from initialAnswers
						};

						return (
							<div key={key}>
								<QuestionEditorInstance
									questionKey={key}
									questionContent={questionText}
									initialConfig={initialConfig}
									// Pass initialContent specific to this key if available
									initialContent={initialAnswers?.[key]}
									// Pass down functions and state from mathLiveManager
									triggerMathfieldFunc={mathLiveManager.triggerMathfield}
									debouncedOnAnswersChange={handleEditorChangeDebounced}
									isLatexInputVisible={mathLiveManager.isLatexInputVisible}
									currentLatexValue={mathLiveManager.currentLatexValue}
									editingNodeKey={mathLiveManager.editingNodeKey}
									activeEditorKey={mathLiveManager.activeEditorKey}
									activeMathLiveKey={mathLiveManager.activeMathLiveKey}
									handleMathfieldInput={mathLiveManager.handleMathfieldInput}
									handleMathfieldKeyDown={
										mathLiveManager.handleMathfieldKeyDown
									}
									commitLatexToEditorFunc={mathLiveManager.commitLatexToEditor}
									isCortexLoaded={isCortexLoaded} // Pass the state
									editorRefMap={editorRefMap}
								/>
							</div>
						);
					})}
			</div>
		);
	},
);

AnswerArea.displayName = "AnswerArea"; // Add display name

export default AnswerArea; // Export the memoized component
