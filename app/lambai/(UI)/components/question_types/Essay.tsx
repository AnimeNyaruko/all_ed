"use client";

import React from "react";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { EditorState, LexicalEditor } from "lexical";
import QuestionEditorInstance from "../../editor/components/QuestionEditorInstance";
import type { AnswerBlock } from "@/types";

interface EssayProps {
	questionKey: string;
	questionContent: string;
	questionNumber: number;
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

const Essay: React.FC<EssayProps> = (props) => {
	// Component này chỉ đơn giản là một trình bao bọc (wrapper) cho QuestionEditorInstance
	// để giữ cho cấu trúc code nhất quán.
	return (
		<div className="p-4 my-2">
			<QuestionEditorInstance {...props} />
		</div>
	);
};

export default Essay; 