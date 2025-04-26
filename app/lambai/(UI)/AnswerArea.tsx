"use client";
import { useState, useRef, useEffect, useCallback, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
	$getRoot,
	$getSelection,
	$setSelection,
	$isRangeSelection,
	EditorState,
	LexicalEditor,
	LexicalNode,
	$getNodeByKey,
	ElementNode,
	TextNode,
	type RangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// Custom Node
import {
	LatexNode,
	$isLatexNode,
	$createLatexNode,
} from "./editor/nodes/LatexNode";

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
								id: `text-${Math.random()}`,
								type: "text",
								content: currentText,
							});
							currentText = "";
						}
						blocks.push({
							id: node.getKey(),
							type: "latex",
							content: node.getLatex(),
						});
					}
				});
				if (currentText) {
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

// Remove the component import, add the context import
// import { LatexPlugin } from "./editor/plugins/LatexPlugin";
import { LatexPluginContext } from "./editor/plugins/LatexPlugin";

// Hook to easily use the context
export const useLatexPluginContext = () => useContext(LatexPluginContext);

// Helper component to listen for the trigger
function LatexTriggerPlugin({
	trigger,
}: {
	trigger: (nodeKey: string | null, initialLatex?: string) => void;
}) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// registerUpdateListener returns a function to unregister the listener
		const removeUpdateListener = editor.registerUpdateListener(
			({ editorState }: { editorState: EditorState }) => {
				editorState.read(() => {
					const selection = $getSelection();
					// Check if selection is collapsed and is a range selection
					if (
						selection !== null &&
						selection.isCollapsed() &&
						$isRangeSelection(selection)
					) {
						const anchorNode = selection.anchor.getNode();
						const anchorOffset = selection.anchor.offset;

						// Check if the anchor node is a text node and has enough characters
						if (anchorNode instanceof TextNode && anchorOffset >= 2) {
							const text = anchorNode.getTextContent().slice(0, anchorOffset);
							// Check if the text ends with '!!'
							if (text.endsWith("!!")) {
								// Schedule an update to remove '!!' and trigger the mathfield
								editor.update(() => {
									// Create a selection for the '!!' characters and assert type
									const rangeToReplace = selection.clone() as RangeSelection;
									rangeToReplace.anchor.offset -= 2;
									// Focus offset remains the same as anchor for collapsed selection
									$setSelection(rangeToReplace);
									// Remove the selected text ('!!')
									rangeToReplace.removeText(); // Use removeText()

									// Trigger the mathfield for a new node
									// Use a timeout to allow Lexical state updates to settle before focusing MathLive
									setTimeout(() => trigger(null, ""), 0);
								});
							}
						}
					}
				});
			},
		);

		// Cleanup function to remove the listener when the component unmounts
		return () => {
			removeUpdateListener();
		};
	}, [editor, trigger]); // Re-run effect if editor or trigger function changes

	return null; // This component doesn't render anything itself
}

export default function AnswerArea({
	questions,
	onAnswersChange,
}: AnswerAreaProps) {
	const [isClient, setIsClient] = useState(false);
	const [isLatexInputVisible, setIsLatexInputVisible] = useState<
		Record<string, boolean>
	>({});
	const [currentLatexValue, setCurrentLatexValue] = useState<
		Record<string, string>
	>({});
	const [editingNodeKey, setEditingNodeKey] = useState<
		Record<string, string | null>
	>({}); // Use Lexical NodeKey
	const [isCortexLoaded, setIsCortexLoaded] = useState(false);
	const [activeEditorKey, setActiveEditorKey] = useState<string | null>(null); // Track which editor's mathfield is open
	const editorRefMap = useRef<Record<string, LexicalEditor | null>>({}); // Store editor instances

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
				console.log("CortexJS/MathLive loaded.");
			};
			script.onerror = () => console.error("Failed to load CortexJS/MathLive.");
			document.body.appendChild(script);
		}

		// Enhanced Cleanup Function
		return () => {
			// Check if the script exists and is still a child of the body
			if (script && document.body.contains(script)) {
				try {
					document.body.removeChild(script);
					console.log("MathLive script removed."); // Optional: for debugging
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

	// Debounced update to parent
	const debouncedOnAnswersChange = useCallback(
		(key: string, editorState: EditorState, editor: LexicalEditor) => {
			// Store the editor instance when it changes
			editorRefMap.current[key] = editor;
			const blocks = lexicalStateToAnswerBlocks(editorState);
			onAnswersChange({ [key]: blocks });
		},
		[onAnswersChange],
	);

	// --- Logic for triggering and handling Mathfield ---
	const triggerMathfield = useCallback(
		(key: string, nodeKey: string | null, initialLatex: string = "") => {
			setActiveEditorKey(key);
			setEditingNodeKey((prev) => ({ ...prev, [key]: nodeKey }));
			setCurrentLatexValue((prev) => ({ ...prev, [key]: initialLatex }));
			setIsLatexInputVisible((prev) => ({ ...prev, [key]: true }));

			setTimeout(() => {
				const mathFieldElement = document.querySelector(
					`#math-input-${key}`,
				) as (HTMLElement & MathfieldElement) | null;
				if (mathFieldElement) {
					mathFieldElement.focus();
					if (nodeKey) mathFieldElement.select();
				}
			}, 50);
		},
		[],
	);

	// Handle Enter in Mathfield
	const handleMathfieldKeyDown = useCallback(
		(key: string, event: React.KeyboardEvent<HTMLElement>) => {
			// Check if Enter is pressed *without* any modifier keys
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

				// Get the specific editor instance for this key
				const editor = editorRefMap.current[key];

				if (editor) {
					editor.update(() => {
						if (currentEditingKey) {
							// Update existing node
							const nodeToUpdate = $getNodeByKey(currentEditingKey);
							if ($isLatexNode(nodeToUpdate)) {
								if (latexValue) {
									nodeToUpdate.setLatex(latexValue);
								} else {
									nodeToUpdate.remove(); // Remove if empty
								}
							}
						} else {
							// Insert new node (at current selection)
							if (latexValue) {
								const selection = $getSelection();
								if (selection) {
									// TODO: Handle !! trigger location more precisely
									const latexNode = $createLatexNode(latexValue);
									selection.insertNodes([latexNode]);
								}
							}
						}
					});
				} else {
					console.error(`Editor instance not found for key: ${key}`);
				}

				// Hide Mathfield, reset states, and Focus the editor *after* the update cycle
				setTimeout(() => {
					setIsLatexInputVisible((prev) => ({ ...prev, [key]: false }));
					setCurrentLatexValue((prev) => ({ ...prev, [key]: "" }));
					setEditingNodeKey((prev) => ({ ...prev, [key]: null }));
					setActiveEditorKey(null);
					editor?.focus();
				}, 0);
			}
		},
		[editingNodeKey],
	);

	const handleMathfieldInput = useCallback((key: string, event: Event) => {
		const target = event.target as EventTarget & { value: string };
		setCurrentLatexValue((prev) => ({ ...prev, [key]: target.value || "" }));
	}, []);

	if (!isClient) {
		return null; // Don't render SSR
	}

	return (
		<div className="space-y-6">
			{Object.entries(questions).map(([key, question]) => {
				const initialConfig = {
					namespace: `AnswerEditor-${key}`,
					theme: editorTheme,
					onError,
					nodes: [LatexNode], // Register custom node
				};

				// Create the trigger function specific to this editor instance's key
				const triggerForThisEditor = (
					nodeKey: string | null,
					initialLatex?: string,
				) => {
					triggerMathfield(key, nodeKey, initialLatex);
				};

				return (
					<div key={key} className="space-y-4">
						{/* Question */}
						<div className="prose max-w-none">
							<ReactMarkdown
								remarkPlugins={[remarkMath]}
								rehypePlugins={[rehypeKatex, rehypeRaw]}
							>
								{question}
							</ReactMarkdown>
						</div>

						{/* --- Lexical Editor --- */}
						<LexicalComposer initialConfig={initialConfig}>
							<div className="border-gray-300 rounded-lg relative border">
								{/* Wrap editor components with LatexPluginContext.Provider */}
								{/* <LatexPlugin triggerMathfield={triggerForThisEditor}> */}
								<LatexPluginContext.Provider
									value={{ triggerMathfield: triggerForThisEditor }}
								>
									<RichTextPlugin
										contentEditable={
											<ContentEditable className="p-4 min-h-[150px] resize-none outline-none" />
										}
										placeholder={
											<div className="top-4 left-4 text-gray-400 pointer-events-none absolute">
												Nhập câu trả lời...
											</div>
										}
										ErrorBoundary={LexicalErrorBoundary}
									/>
									<HistoryPlugin />
									<OnChangePlugin
										onChange={(editorState, editor) =>
											debouncedOnAnswersChange(key, editorState, editor)
										}
									/>
									{/* Add the trigger plugin inside the provider */}
									<LatexTriggerPlugin trigger={triggerForThisEditor} />
									{/* Other core plugins can go inside the provider */}
									{/* </LatexPlugin> */}
								</LatexPluginContext.Provider>
							</div>
						</LexicalComposer>
						{/* ---------------------- */}

						{/* --- Separate Mathfield Input Area (Conditional) --- */}
						{activeEditorKey === key &&
							isLatexInputVisible[key] &&
							isCortexLoaded && (
								<div className="mt-2 p-2 border-blue-300 rounded bg-blue-50 border">
									<label
										htmlFor={`math-input-${key}`}
										className="text-sm font-medium text-gray-700 mb-1 block"
									>
										{editingNodeKey[key] ? "Sửa" : "Nhập"} LaTeX (Enter để hoàn
										thành):
									</label>
									{/* @ts-expect-error // Mathfield types might not be perfectly defined */}
									<math-field
										id={`math-input-${key}`}
										style={{
											display: "block",
											width: "100%",
											border: "1px solid #ccc",
											padding: "5px",
											fontSize: "1em",
										}}
										value={currentLatexValue[key] || ""}
										onInput={(e: Event) => handleMathfieldInput(key, e)}
										onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
											handleMathfieldKeyDown(key, e)
										}
										virtual-keyboard-mode="manual"
										// @ts-expect-error // Mathfield types might not be perfectly defined
									></math-field>
								</div>
							)}
						{/* --------------------------------------- */}

						{/* Separator */}
						<div className="border-gray-200 mt-4 border-t" />
					</div>
				);
			})}
		</div>
	);
}
