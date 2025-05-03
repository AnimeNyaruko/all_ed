import React from "react";
import { InlineMath } from "react-katex";
import type { NodeKey } from "lexical";
import { useLatexPluginContext } from "../plugins/LatexPlugin";

// Define props for the component
interface LatexComponentProps {
	latex: string;
	nodeKey: NodeKey;
	// We might need a function passed down to trigger the editing state
	// triggerEdit: (nodeKey: NodeKey, currentLatex: string) => void; // Removed prop
}

const LatexComponent: React.FC<LatexComponentProps> = ({
	latex,
	nodeKey,
	// triggerEdit, // Removed prop
}) => {
	const [isSelected, setIsSelected] = React.useState(false); // Example state for visual feedback
	const { triggerMathfield } = useLatexPluginContext(); // Get the function from context

	const handleClick = (event: React.MouseEvent) => {
		event.preventDefault(); // Prevent default span interactions
		// Tell the parent plugin/component to start editing this node
		// triggerEdit(nodeKey, latex); // Removed prop
		triggerMathfield(nodeKey, latex); // Use the function from context
		// You could potentially use editor.update here to manage selection state
		// or rely on a higher-level state as planned.
		setIsSelected(true); // Basic visual feedback
	};

	// Reset selection visuals if needed elsewhere, maybe on editor update?

	return (
		<span
			onClick={handleClick}
			style={{
				cursor: "pointer",
				padding: "2px 4px",
				margin: "0 1px",
				borderRadius: "4px",
				backgroundColor: isSelected ? "#bae6fd" : "#e5e7eb",
				border: isSelected ? "1px solid transparent" : "1px solid #d1d5db",
			}} // Simple styling
		>
			<InlineMath math={latex || "\placeholder{}"} />
		</span>
	);
};

export default LatexComponent;
