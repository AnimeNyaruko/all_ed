import { createContext, useContext } from "react";
import { NodeKey } from "lexical";

// Define the type for the context value
export interface LatexPluginContextType {
	triggerMathfield: (nodeKey: NodeKey, initialLatex: string) => void;
}

// Create the context with a default value (or null/undefined and handle it)
// Using a dummy function as default to satisfy the type, consumers MUST be under a Provider
export const LatexPluginContext = createContext<LatexPluginContextType>({
	triggerMathfield: () => {
		console.error("LatexPluginContext Provider not found");
	},
});

// Hook to easily use the context
export const useLatexPluginContext = () => useContext(LatexPluginContext);
