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

			// Reset state after committing - HOÀN NGUYÊN setTimeout
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

	// Handler for specific keydown events on the MathLive input
	// This is needed for things like Enter to commit, Escape to cancel, etc.
	const handleMathfieldKeyDown = useCallback(
		(key: string, event: React.KeyboardEvent<HTMLElement>) => {
			// Enter key (without modifiers) commits the LaTeX
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!event.metaKey
			) {
				event.preventDefault();
				// Use intermediate 'unknown' cast to satisfy linter
				const mathfieldElement = event.target as unknown as MathfieldElement;
				const value = mathfieldElement.value?.trim() ?? "";
				commitLatexToEditor(key, value);
			}
			// Example: Escape key to cancel (clears state without committing)
			else if (event.key === "Escape") {
				event.preventDefault();
				// Reset state without committing
				setIsLatexInputVisible((prev) => ({ ...prev, [key]: false }));
				setCurrentLatexValue((prev) => ({ ...prev, [key]: "" }));
				setEditingNodeKey((prev) => ({ ...prev, [key]: null }));
				setActiveEditorKey(null);
				setActiveMathLiveKey(null);
				// Focus back on the editor
				const editor = editorRefMap.current?.[key];
				if (editor) {
					editor.focus();
				}
			}
			// Add other keydown handling if needed
		},
		[commitLatexToEditor, editorRefMap], // Include dependencies
	);

	return {
		isLatexInputVisible,
		currentLatexValue,
		editingNodeKey,
		activeEditorKey,
		activeMathLiveKey,
		triggerMathfield,
		handleMathfieldInput,
		handleMathfieldKeyDown, // Add the function to the return object
		commitLatexToEditor,
	};
}
