import React, { useCallback, useRef, useEffect, memo } from "react";
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
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import MathShortcutPlugin from "../plugins/MathShortcutPlugin";
import LatexTriggerPlugin from "../plugins/LatexTriggerPlugin";
import { LatexNode } from "../nodes/LatexNode";
import { useMathLiveManager } from "../hooks/useMathLiveManager";
import { LatexPluginContext } from "../plugins/LatexPlugin";
import InitialContentPlugin from "../plugins/InitialContentPlugin";
import type { AnswerBlock } from "@/types";

// Props cho QuestionEditorInstance (component chính)
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
	commitLatexToEditorFunc: (key: string, latexValue: string) => void;
	isCortexLoaded: boolean;
	editorRefMap: React.MutableRefObject<Record<string, LexicalEditor | null>>;
}

// Props cho EditorUIAndMathfield (component con)
// Chỉ bao gồm các props thực sự cần thiết bởi nó
interface EditorUIAndMathfieldProps {
	questionKey: string;
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
	commitLatexToEditorFunc: (key: string, latexValue: string) => void;
	isCortexLoaded: boolean;
}

// Plugin to get editor instance and update ref map
function EditorRefPlugin({
	editorKey,
	editorRefMap,
}: {
	editorKey: string;
	editorRefMap: React.MutableRefObject<Record<string, LexicalEditor | null>>;
}) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		// Lưu ref vào biến cục bộ để dùng trong cleanup
		const currentMap = editorRefMap.current;
		currentMap[editorKey] = editor;
		// Cleanup function to remove the reference when the component unmounts
		return () => {
			// Dùng biến cục bộ trong cleanup
			if (currentMap) {
				currentMap[editorKey] = null;
			}
		};
		// Thêm currentMap vào dependency array nếu cần, nhưng thường thì không
		// vì nó là ref. Chỉ cần đảm bảo logic cleanup đúng.
	}, [editor, editorKey, editorRefMap]);
	return null;
}

// Inner component moved to file level and memoized
// Sử dụng định nghĩa props mới EditorUIAndMathfieldProps
const EditorUIAndMathfield = memo<EditorUIAndMathfieldProps>(
	({
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
		handleMathfieldKeyDown,
		commitLatexToEditorFunc,
		isCortexLoaded,
	}) => {
		const mathfieldRef = useRef<MathfieldElement | null>(null);

		const triggerForThisKey = useCallback(
			(nodeKey: string | null, initialLatex?: string) => {
				triggerMathfieldFunc(questionKey, nodeKey, initialLatex);
			},
			[triggerMathfieldFunc, questionKey],
		);

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
			},
			[questionKey, commitLatexToEditorFunc],
		);

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
							onChange={(editorState, currentEditor) =>
								debouncedOnAnswersChange(
									questionKey,
									editorState,
									currentEditor,
								)
							}
						/>
						<InitialContentPlugin initialContent={initialContent} />
						<LatexTriggerPlugin trigger={triggerForThisKey} />
						<MathShortcutPlugin />
					</LatexPluginContext.Provider>
				</div>

				{activeEditorKey === questionKey &&
					isLatexInputVisible[questionKey] &&
					isCortexLoaded && (
						<div className="mt-2 p-4 bg-blue-50 border-blue-300 shadow-lg rounded relative border">
							<label
								htmlFor={`math-input-${questionKey}`}
								className="text-sm font-medium text-gray-700 mb-1 pr-20 block"
							>
								{editingNodeKey[questionKey] ? "Sửa" : "Nhập"} LaTeX (Enter hoặc
								Hoàn thành):
							</label>
							<button
								type="button"
								className="top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded hover:bg-green-600 focus:ring-green-400 focus:ring-opacity-75 absolute focus:ring-2 focus:outline-none"
								onClick={handleCompleteButtonClick}
							>
								Hoàn thành
							</button>
							{/* @ts-expect-error TODO: Improve type definitions for math-field */}
							<math-field
								className="bg-white block w-full border border-solid border-[#ccc] p-[5px] text-[1em]"
								id={`math-input-${questionKey}`}
								value={currentLatexValue[questionKey] || ""}
								onInput={(e: Event) => handleMathfieldInput(questionKey, e)}
								onKeyDown={handleKeyDown}
								virtual-keyboard-mode="manual"
								ref={mathfieldRef}
								// @ts-expect-error TODO: Improve type definitions for math-field
							></math-field>
						</div>
					)}
			</>
		);
	},
);
EditorUIAndMathfield.displayName = "EditorUIAndMathfield";

// Main component that sets up the composer
// Sử dụng định nghĩa props chính QuestionEditorInstanceProps
const QuestionEditorInstance = memo<QuestionEditorInstanceProps>(
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
		commitLatexToEditorFunc,
		isCortexLoaded,
		editorRefMap,
	}) => {
		return (
			<div className="space-y-4">
				<div className="prose max-w-none">
					<ReactMarkdown
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex, rehypeRaw]}
					>
						{questionContent}
					</ReactMarkdown>
				</div>

				<LexicalComposer initialConfig={initialConfig}>
					<EditorRefPlugin
						editorKey={questionKey}
						editorRefMap={editorRefMap}
					/>
					<EditorUIAndMathfield
						questionKey={questionKey}
						initialContent={initialContent}
						triggerMathfieldFunc={triggerMathfieldFunc}
						debouncedOnAnswersChange={debouncedOnAnswersChange}
						isLatexInputVisible={isLatexInputVisible}
						currentLatexValue={currentLatexValue}
						editingNodeKey={editingNodeKey}
						activeEditorKey={activeEditorKey}
						activeMathLiveKey={activeMathLiveKey}
						handleMathfieldInput={handleMathfieldInput}
						handleMathfieldKeyDown={handleMathfieldKeyDown}
						commitLatexToEditorFunc={commitLatexToEditorFunc}
						isCortexLoaded={isCortexLoaded}
					/>
				</LexicalComposer>

				<div className="border-gray-200 mt-4 border-t" />
			</div>
		);
	},
);

QuestionEditorInstance.displayName = "QuestionEditorInstance";
export default QuestionEditorInstance;
