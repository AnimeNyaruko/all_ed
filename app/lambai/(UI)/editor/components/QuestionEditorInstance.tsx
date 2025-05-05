import React, { useCallback, useRef } from "react";
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
import { MathfieldElement } from "mathlive";

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
	commitLatexToEditorFunc: (key: string, latexValue: string) => void;
	isCortexLoaded: boolean;
}

// Inner component that has access to the Lexical Composer context
const EditorUIAndMathfield: React.FC<QuestionEditorInstanceProps> = ({
	questionKey,
	initialContent,
	triggerMathfieldFunc,
	debouncedOnAnswersChange,
	isLatexInputVisible,
	currentLatexValue,
	editingNodeKey,
	activeEditorKey,
	activeMathLiveKey,
	handleMathfieldInput,
	commitLatexToEditorFunc,
	isCortexLoaded,
	initialConfig,
}) => {
	const mathfieldRef = useRef<MathfieldElement | null>(null);

	// Create the specific trigger function needed by the context/plugins
	// This function now has a stable reference if triggerMathfieldFunc is stable
	const triggerForThisKey = useCallback(
		(nodeKey: string | null, initialLatex?: string) => {
			triggerMathfieldFunc(questionKey, nodeKey, initialLatex);
		},
		[triggerMathfieldFunc, questionKey], // Dependencies
	);

	// Extract the specific visibility state for the dependency array
	// New unified KeyDown handler for MathLive input
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey
			) {
				event.preventDefault();
				const value = mathfieldRef.current?.value?.trim() ?? "";
				commitLatexToEditorFunc(questionKey, value);
			}
			// Add other keydown handling if needed (e.g., Escape key)
			// else if (event.key === 'Escape') { ... }
		},
		[questionKey, commitLatexToEditorFunc],
	); // Dependencies

	// New handler for the "Complete" button click
	const handleCompleteButtonClick = useCallback(() => {
		if (!mathfieldRef.current) return;
		const value = mathfieldRef.current.value?.trim() ?? "";
		commitLatexToEditorFunc(questionKey, value);
	}, [questionKey, commitLatexToEditorFunc]);

	return (
		<>
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
								Nhập câu trả lời... Dùng &apos;!!&apos; hoặc Ctrl+Q để chèn công
								thức.
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<OnChangePlugin
						onChange={(editorState, currentEditor) =>
							// Pass the correct editor instance from onChange
							debouncedOnAnswersChange(questionKey, editorState, currentEditor)
						}
					/>
					<InitialContentPlugin initialContent={initialContent} />
					{/* Pass the stable trigger function to the plugin */}
					<LatexTriggerPlugin trigger={triggerForThisKey} />
					<MathShortcutPlugin />
				</LatexPluginContext.Provider>
			</div>

			{/* Conditional MathLive Input Area - Now rendered directly */}
			{activeEditorKey === questionKey &&
				isLatexInputVisible[questionKey] &&
				isCortexLoaded && (
					<div
						// Add position: relative for the button positioning context
						className="mt-2 p-4 bg-blue-50 border-blue-300 shadow-lg rounded relative border"
						// Removed fixed positioning, added margin-top
					>
						<label
							htmlFor={`math-input-${questionKey}`}
							className="text-sm font-medium text-gray-700 mb-1 pr-20 block" // Add padding-right to avoid overlap with button
						>
							{editingNodeKey[questionKey] ? "Sửa" : "Nhập"} LaTeX (Enter hoặc
							Hoàn thành):
						</label>
						{/* Add the Complete button */}
						<button
							type="button" // Important for form contexts
							className="top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600 focus:ring-green-400 focus:ring-opacity-75 absolute focus:ring-2 focus:outline-none"
							onClick={handleCompleteButtonClick}
						>
							Hoàn thành
						</button>
						{/* Use the math-field web component */}
						{/* @ts-expect-error TODO: Improve type definitions for math-field */}
						<math-field
							className="bg-white block w-full border border-solid border-[#ccc] p-[5px] text-[1em]"
							id={`math-input-${questionKey}`}
							value={currentLatexValue[questionKey] || ""}
							onInput={(e: Event) => handleMathfieldInput(questionKey, e)}
							// Keep existing onKeyDown for physical Enter
							onKeyDown={handleKeyDown}
							virtual-keyboard-mode="manual"
							// Add ref to access the DOM element
							ref={mathfieldRef}
							// @ts-expect-error TODO: Improve type definitions for math-field
						></math-field>
					</div>
				)}
		</>
	);
};

// Main component that sets up the composer
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
		commitLatexToEditorFunc,
		isCortexLoaded,
	}: QuestionEditorInstanceProps) => {
		// Remove useLexicalComposerContext from here
		// const [editor] = useLexicalComposerContext();
		// Remove mathfieldRef from here, it's moved inside EditorUIAndMathfield
		// const mathfieldRef = useRef<HTMLElement & { value: string } | null>(null);

		// Remove triggerForThisKey useCallback from here, it's moved inside
		/*
		const triggerForThisKey = useCallback(
			(nodeKey: string | null, initialLatex?: string) => {
				triggerMathfieldFunc(questionKey, nodeKey, initialLatex);
			},
			[triggerMathfieldFunc, questionKey], // Dependencies
		);
		*/

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
					{/* Render the inner component which uses the context */}
					<EditorUIAndMathfield
						// Pass all necessary props down
						questionKey={questionKey}
						questionContent={questionContent} // Pass if needed by inner, currently not
						initialContent={initialContent}
						triggerMathfieldFunc={triggerMathfieldFunc}
						debouncedOnAnswersChange={debouncedOnAnswersChange}
						isLatexInputVisible={isLatexInputVisible}
						currentLatexValue={currentLatexValue}
						editingNodeKey={editingNodeKey}
						activeEditorKey={activeEditorKey}
						activeMathLiveKey={activeMathLiveKey}
						handleMathfieldInput={handleMathfieldInput}
						commitLatexToEditorFunc={commitLatexToEditorFunc}
						isCortexLoaded={isCortexLoaded}
						// Pass the missing prop
						initialConfig={initialConfig}
					/>
				</LexicalComposer>

				{/* Separator */}
				<div className="border-gray-200 mt-4 border-t" />
			</div>
		);
	},
);

QuestionEditorInstance.displayName = "QuestionEditorInstance"; // Add display name

// Ensure the component is exported as default
export default QuestionEditorInstance;
