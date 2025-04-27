import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KEY_DOWN_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { useLatexPluginContext } from "./LatexPlugin"; // Import the context hook

// Priority for the command listener. Lower number means higher priority.
// We want this to run fairly early to potentially intercept Ctrl+Q.
const COMMAND_PRIORITY = 1;

export default function MathShortcutPlugin() {
	const [editor] = useLexicalComposerContext();
	const { triggerMathfield, activeMathLiveKey } = useLatexPluginContext();

	useEffect(() => {
		// Register the command listener when the component mounts
		const unregister = editor.registerCommand(
			KEY_DOWN_COMMAND,
			(event: KeyboardEvent) => {
				// Check for Ctrl + Q combination
				if (event.ctrlKey && event.key.toLowerCase() === "q") {
					// Prevent the browser's default behavior for Ctrl+Q (e.g., quit)
					event.preventDefault();

					// Use editor.update to safely interact with the editor state
					editor.update(() => {
						const selection = $getSelection();
						// If there's a selection, remove the selected content
						if ($isRangeSelection(selection) && !selection.isCollapsed()) {
							selection.removeText();
						}
						// Trigger the MathLive input for a new equation
						// Pass null for nodeKey as this is always for a new equation
						triggerMathfield(null, ""); // Pass empty string for initialLatex
					});

					return true; // Indicate the event is handled
				}
				// If it wasn't Ctrl+Q or was ignored, let other listeners handle it
				return false;
			},
			COMMAND_PRIORITY,
		);

		// Return the unregister function to be called on component unmount
		return () => {
			unregister();
		};
	}, [editor, triggerMathfield, activeMathLiveKey]); // Dependencies for the effect

	// This plugin doesn't render anything itself
	return null;
}
