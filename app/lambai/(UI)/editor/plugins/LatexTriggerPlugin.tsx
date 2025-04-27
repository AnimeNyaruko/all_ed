import { useEffect } from "react";
import {
	$getSelection,
	$isRangeSelection,
	$setSelection,
	EditorState,
	TextNode,
	type RangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface LatexTriggerPluginProps {
	trigger: (nodeKey: string | null, initialLatex?: string) => void;
}

export default function LatexTriggerPlugin({
	trigger,
}: LatexTriggerPluginProps) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const removeUpdateListener = editor.registerUpdateListener(
			({ editorState }: { editorState: EditorState }) => {
				editorState.read(() => {
					const selection = $getSelection();
					if (
						selection !== null &&
						selection.isCollapsed() &&
						$isRangeSelection(selection)
					) {
						const anchorNode = selection.anchor.getNode();
						const anchorOffset = selection.anchor.offset;

						if (anchorNode instanceof TextNode && anchorOffset >= 2) {
							const text = anchorNode.getTextContent().slice(0, anchorOffset);
							if (text.endsWith("!!")) {
								editor.update(() => {
									const rangeToReplace = selection.clone() as RangeSelection;
									rangeToReplace.anchor.offset -= 2;
									$setSelection(rangeToReplace);
									rangeToReplace.removeText();

									// Trigger the mathfield (passed via props)
									setTimeout(() => trigger(null, ""), 0);
								});
							}
						}
					}
				});
			},
		);

		return () => {
			removeUpdateListener();
		};
	}, [editor, trigger]);

	return null; // Plugin doesn't render UI
}
