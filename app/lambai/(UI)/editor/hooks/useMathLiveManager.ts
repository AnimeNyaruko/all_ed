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
	// editorRefMap is no longer the primary way to get the editor for commit
	// It might still be needed for other purposes, but commit logic is changed.
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

	// New function to handle committing LaTeX and resetting state
	const commitLatexToEditor = useCallback(
		// Revert signature: Only key and value are needed from outside
		(key: string, latexValue: string) => {
			const currentEditingKey = editingNodeKey[key];
			// Get editor instance using the ref map inside the hook
			const editor = editorRefMap.current?.[key];

			// Add null check for the editor instance
			if (!editor) {
				console.error(
					`[${key}] Editor instance not found in commitLatexToEditor. Cannot commit.`,
				);
				// Optionally reset state here too?
				// Reset MathLive specific state even if editor commit fails
				setIsLatexInputVisible((prev) => ({ ...prev, [key]: false }));
				setCurrentLatexValue((prev) => ({ ...prev, [key]: "" }));
				setEditingNodeKey((prev) => ({ ...prev, [key]: null }));
				setActiveEditorKey(null);
				setActiveMathLiveKey(null);
				return;
			}

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

			// Reset state after committing
			setTimeout(() => {
				setIsLatexInputVisible((prev) => ({ ...prev, [key]: false }));
				setCurrentLatexValue((prev) => ({ ...prev, [key]: "" }));
				setEditingNodeKey((prev) => ({ ...prev, [key]: null }));
				setActiveEditorKey(null);
				setActiveMathLiveKey(null);
				// Focus back on the Lexical editor after closing MathLive
				editor.focus();
			}, 0);
		},
		[editingNodeKey, editorRefMap], // Restore editorRefMap dependency
	);

	const handleMathfieldInput = useCallback(
		(key: string, event: Event) => {
			// Ensure target has value property
			const target = event.target as EventTarget & { value?: string };
			const newValue = target.value ?? "";
			setCurrentLatexValue((prev) => ({ ...prev, [key]: newValue }));
			setEditingNodeKey((prev) => ({ ...prev, [key]: null })); // Clear editing node if typing new
		},
		[setCurrentLatexValue, setEditingNodeKey],
	);

	return {
		isLatexInputVisible,
		currentLatexValue,
		editingNodeKey,
		activeEditorKey,
		activeMathLiveKey,
		triggerMathfield,
		handleMathfieldInput,
		commitLatexToEditor,
	};
}
