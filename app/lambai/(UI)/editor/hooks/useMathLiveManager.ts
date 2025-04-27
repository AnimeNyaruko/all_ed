import { useState, useCallback, RefObject } from "react";
import { LexicalEditor, $getNodeByKey, $getSelection } from "lexical";
import { $createLatexNode, $isLatexNode } from "../nodes/LatexNode";

// Re-define the MathfieldElement interface here or import from a shared types file
interface MathfieldElement {
	value: string;
	focus(): void;
	select(): void;
	scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
}

interface UseMathLiveManagerProps {
	editorRefMap: RefObject<Record<string, LexicalEditor | null>>;
}

export function useMathLiveManager({ editorRefMap }: UseMathLiveManagerProps) {
	const [isLatexInputVisible, setIsLatexInputVisible] = useState<
		Record<string, boolean>
	>({});
	const [currentLatexValue, setCurrentLatexValue] = useState<
		Record<string, string>
	>({});
	const [editingNodeKey, setEditingNodeKey] = useState<
		Record<string, string | null>
	>({});
	const [activeEditorKey, setActiveEditorKey] = useState<string | null>(null);
	const [activeMathLiveKey, setActiveMathLiveKey] = useState<string | null>(
		null,
	);

	const triggerMathfield = useCallback(
		(key: string, nodeKey: string | null, initialLatex: string = "") => {
			if (activeMathLiveKey && activeMathLiveKey !== key) {
				const activeMathfieldElement = document.getElementById(
					`math-input-${activeMathLiveKey}`,
				) as MathfieldElement | null;
				if (activeMathfieldElement) {
					activeMathfieldElement.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
					activeMathfieldElement.focus();
					console.warn(
						`MathLive for editor ${activeMathLiveKey} is already active. Please complete it first.`,
					);
				}
				return;
			}

			setActiveEditorKey(key);
			setEditingNodeKey((prev) => ({ ...prev, [key]: nodeKey }));
			setCurrentLatexValue((prev) => ({ ...prev, [key]: initialLatex }));
			setIsLatexInputVisible((prev) => ({ ...prev, [key]: true }));
			setActiveMathLiveKey(key);

			setTimeout(() => {
				const mathFieldElement = document.getElementById(
					`math-input-${key}`,
				) as (HTMLElement & MathfieldElement) | null;
				if (mathFieldElement) {
					mathFieldElement.focus();
					if (nodeKey) mathFieldElement.select();
				}
			}, 50);
		},
		[activeMathLiveKey],
	);

	const handleMathfieldKeyDown = useCallback(
		(key: string, event: React.KeyboardEvent<HTMLElement>) => {
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey
			) {
				event.preventDefault();
				const mathField = event.target as EventTarget & { value: string };
				const latexValue = mathField.value.trim();
				const currentEditingKey = editingNodeKey[key];
				const editor = editorRefMap.current?.[key];

				if (editor) {
					editor.update(() => {
						if (currentEditingKey) {
							const nodeToUpdate = $getNodeByKey(currentEditingKey);
							if ($isLatexNode(nodeToUpdate)) {
								if (latexValue) {
									nodeToUpdate.setLatex(latexValue);
								} else {
									nodeToUpdate.remove();
								}
							}
						} else {
							if (latexValue) {
								const selection = $getSelection();
								if (selection) {
									const latexNode = $createLatexNode(latexValue);
									selection.insertNodes([latexNode]);
								}
							}
						}
					});
				} else {
					console.error(`Editor instance not found for key: ${key}`);
				}

				setTimeout(() => {
					setIsLatexInputVisible((prev) => ({ ...prev, [key]: false }));
					setCurrentLatexValue((prev) => ({ ...prev, [key]: "" }));
					setEditingNodeKey((prev) => ({ ...prev, [key]: null }));
					setActiveEditorKey(null);
					setActiveMathLiveKey(null);
					editor?.focus();
				}, 0);
			}
		},
		[editingNodeKey, editorRefMap],
	);

	const handleMathfieldInput = useCallback((key: string, event: Event) => {
		const target = event.target as EventTarget & { value: string };
		setCurrentLatexValue((prev) => ({ ...prev, [key]: target.value || "" }));
	}, []);

	return {
		isLatexInputVisible,
		currentLatexValue,
		editingNodeKey,
		activeEditorKey,
		activeMathLiveKey,
		triggerMathfield,
		handleMathfieldKeyDown,
		handleMathfieldInput,
	};
}
