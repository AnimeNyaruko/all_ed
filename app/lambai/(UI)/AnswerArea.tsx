"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import "katex/dist/katex.min.css";
import { EditorState, LexicalEditor } from "lexical";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { useMathLiveManager } from "./editor/hooks/useMathLiveManager";
import QuestionEditorInstance from "./editor/components/QuestionEditorInstance";
import MultipleChoice from "./components/question_types/MultipleChoice";
import TrueFalse from "./components/question_types/TrueFalse";
import ShortAnswer from "./components/question_types/ShortAnswer";
import Essay from "./components/question_types/Essay";
import {
	Question,
	QuestionType,
	AnswersState,
	Answer,
} from "../(data)/mock-questions";

// Custom Node
import { LatexNode, $isLatexNode } from "./editor/nodes/LatexNode";
import { lexicalStateToAnswerBlocks } from "./editor/utils/lexicalUtils";
import type { AnswerBlock } from "@/types";

interface AnswerAreaProps {
	// questions: Record<string, string>;
    // initialAnswers?: Record<string, AnswerBlock[]>;
    // onAnswersChange: (answers: Record<string, AnswerBlock[]>) => void; // Expect AnswerBlock array
	questions: Question[]; // Updated to use the new Question interface
	initialAnswers?: AnswersState; // Updated to use the new AnswersState type
	onAnswersChange: (answers: AnswersState) => void;
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

		// Debounced handler using setTimeout for essay questions
		const handleEditorChangeDebounced = useCallback(
			(key: string, editorState: EditorState, editor: LexicalEditor) => {
				editorRefMap.current[key] = editor;

				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}

				debounceTimeoutRef.current = setTimeout(() => {
					const blocks = lexicalStateToAnswerBlocks(editorState);
					onAnswersChange({ [key]: blocks });
				}, 500);
			},
			[onAnswersChange],
		);

		// Handler for other question types
		const handleSimpleAnswerChange = useCallback(
			(questionId: string, answer: Answer) => {
				onAnswersChange({ [questionId]: answer });
			},
			[onAnswersChange],
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
					questions.map((question, index) => {
						const { id, type, content, options } = question;
						const questionNumber = index + 1;

						switch (type) {
							case "essay": {
								// Create Lexical config for each instance
								const initialConfig: InitialConfigType = {
									namespace: `QuestionEditor-${id}`,
									theme: editorTheme,
									onError: onError,
									nodes: [LatexNode],
									editorState: null,
								};
								const initialEssayContent =
									initialAnswers &&
									Array.isArray(initialAnswers[id]) &&
									(initialAnswers[id] as AnswerBlock[]).length > 0
										? (initialAnswers[id] as AnswerBlock[])
										: undefined;

								return (
									<Essay
										key={id}
										questionKey={id}
										questionContent={content}
										questionNumber={questionNumber}
										initialConfig={initialConfig}
										initialContent={initialEssayContent}
										triggerMathfieldFunc={mathLiveManager.triggerMathfield}
										debouncedOnAnswersChange={handleEditorChangeDebounced}
										isLatexInputVisible={
											mathLiveManager.isLatexInputVisible
										}
										currentLatexValue={mathLiveManager.currentLatexValue}
										editingNodeKey={mathLiveManager.editingNodeKey}
										activeEditorKey={mathLiveManager.activeEditorKey}
										activeMathLiveKey={mathLiveManager.activeMathLiveKey}
										handleMathfieldInput={
											mathLiveManager.handleMathfieldInput
										}
										handleMathfieldKeyDown={
											mathLiveManager.handleMathfieldKeyDown
										}
										commitLatexToEditorFunc={
											mathLiveManager.commitLatexToEditor
										}
										isCortexLoaded={isCortexLoaded} // Pass the state
										editorRefMap={editorRefMap}
									/>
								);
							}
							case "multiple_choice":
								return (
									<MultipleChoice
										key={id}
										question={{ ...question, options: question.options || [] }}
										questionNumber={questionNumber}
										onChange={handleSimpleAnswerChange}
									/>
								);
							case "true_false":
								return (
									<TrueFalse
										key={id}
										question={{
											...question,
											sub_questions: question.sub_questions || [],
										}}
										questionNumber={questionNumber}
										onChange={handleSimpleAnswerChange}
									/>
								);
							case "short_answer":
								return (
									<ShortAnswer
										key={id}
										question={question}
										questionNumber={questionNumber}
										onChange={handleSimpleAnswerChange}
									/>
								);
							default:
								return (
									<div key={id} className="p-4 text-red-500">
										Loại câu hỏi không xác định: {type}
									</div>
								);
						}
					})}
			</div>
		);
	},
);

AnswerArea.displayName = "AnswerArea";

export default AnswerArea;
