import React, { useCallback, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import {
	LexicalComposer,
	InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { type LexicalEditor, type EditorState } from "lexical";

// Assuming LatexPluginContext and LatexTriggerPlugin are correctly exported from these paths
import { LatexPluginContext } from "../plugins/LatexPlugin";
import LatexTriggerPlugin from "../plugins/LatexTriggerPlugin";
import MathShortcutPlugin from "../plugins/MathShortcutPlugin";
import InitialContentPlugin from "../plugins/InitialContentPlugin";
import type { AnswerBlock } from "@/types";

// Define the props based on what's passed from AnswerArea
interface QuestionEditorInstanceProps {
	questionKey: string;
	questionContent: string;
	initialConfig: InitialConfigType;
	initialContent?: AnswerBlock[];
	triggerMathfieldFunc: (
		key: string,
		nodeKey: string | null,
		initialLatex?: string,
	) => void;
	debouncedOnAnswersChange: (
		key: string,
		editorState: EditorState,
		editor: LexicalEditor,
	) => void;
	isLatexInputVisible: Record<string, boolean>;
	currentLatexValue: Record<string, string>;
	editingNodeKey: Record<string, string | null>;
	activeEditorKey: string | null;
	activeMathLiveKey: string | null;
	handleMathfieldInput: (key: string, event: Event) => void;
	handleMathfieldKeyDown: (
		key: string,
		event: React.KeyboardEvent<HTMLElement>,
	) => void;
	isCortexLoaded: boolean;
}

// Wrap the component with React.memo
const QuestionEditorInstance = React.memo(
	({
		questionKey,
		questionContent,
		initialConfig,
		initialContent,
		triggerMathfieldFunc,
		debouncedOnAnswersChange,
		isLatexInputVisible,
		currentLatexValue,
		editingNodeKey,
		activeEditorKey,
		activeMathLiveKey,
		handleMathfieldInput,
		handleMathfieldKeyDown,
		isCortexLoaded,
	}: QuestionEditorInstanceProps) => {
		// State to track client-side mounting for portal
		// const [isMounted, setIsMounted] = useState(false);

		// useEffect(() => {
		// 	setIsMounted(true);
		// }, []);

		// Create the specific trigger function needed by the context/plugins
		// This function now has a stable reference if triggerMathfieldFunc is stable
		const triggerForThisKey = useCallback(
			(nodeKey: string | null, initialLatex?: string) => {
				triggerMathfieldFunc(questionKey, nodeKey, initialLatex);
			},
			[triggerMathfieldFunc, questionKey], // Dependencies
		);

		return (
			<div className="space-y-4">
				{/* Question Display */}
				<div className="prose max-w-none">
					<ReactMarkdown
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex, rehypeRaw]}
					>
						{questionContent}
					</ReactMarkdown>
				</div>

				{/* Lexical Editor Setup */}
				<LexicalComposer initialConfig={initialConfig}>
					<div className="border-gray-300 rounded-lg relative border">
						<LatexPluginContext.Provider
							value={{
								// Use the newly created stable trigger function
								triggerMathfield: triggerForThisKey,
								activeMathLiveKey,
							}}
						>
							<RichTextPlugin
								contentEditable={
									<ContentEditable
										className="p-4 min-h-[150px] resize-none outline-none"
										readOnly={isLatexInputVisible[questionKey]}
									/>
								}
								placeholder={
									<div className="top-4 left-4 text-gray-400 pointer-events-none absolute">
										Nhập câu trả lời... Dùng &apos;!!&apos; hoặc Ctrl+Q để chèn
										công thức.
									</div>
								}
								ErrorBoundary={LexicalErrorBoundary}
							/>
							<HistoryPlugin />
							<OnChangePlugin
								onChange={(editorState, editor) =>
									debouncedOnAnswersChange(questionKey, editorState, editor)
								}
							/>
							<InitialContentPlugin initialContent={initialContent} />
							{/* Pass the stable trigger function to the plugin */}
							<LatexTriggerPlugin trigger={triggerForThisKey} />
							<MathShortcutPlugin />
						</LatexPluginContext.Provider>
					</div>
				</LexicalComposer>

				{/* Conditional MathLive Input Area - Now rendered directly */}
				{activeEditorKey === questionKey &&
					isLatexInputVisible[questionKey] &&
					isCortexLoaded && (
						<div
							className="mt-2 p-4 bg-blue-50 border-blue-300 shadow-lg rounded border"
							// Removed fixed positioning, added margin-top
						>
							<label
								htmlFor={`math-input-${questionKey}`}
								className="text-sm font-medium text-gray-700 mb-1 block"
							>
								{editingNodeKey[questionKey] ? "Sửa" : "Nhập"} LaTeX (Enter để
								hoàn thành):
							</label>
							{/* Use the math-field web component */}
							{/* @ts-expect-error TODO: Improve type definitions for math-field */}
							<math-field
								id={`math-input-${questionKey}`}
								style={{
									display: "block",
									width: "100%",
									border: "1px solid #ccc",
									padding: "5px",
									fontSize: "1em",
									// Ensure background is opaque if needed
									backgroundColor: "white",
								}}
								value={currentLatexValue[questionKey] || ""}
								onInput={(e: Event) => handleMathfieldInput(questionKey, e)}
								onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
									handleMathfieldKeyDown(questionKey, e)
								}
								virtual-keyboard-mode="manual"
								// @ts-expect-error TODO: Improve type definitions for math-field
							></math-field>
						</div>
					)}

				{/* Separator */}
				<div className="border-gray-200 mt-4 border-t" />
			</div>
		);
	},
);

QuestionEditorInstance.displayName = "QuestionEditorInstance"; // Add display name

// Ensure the component is exported as default
export default QuestionEditorInstance;
