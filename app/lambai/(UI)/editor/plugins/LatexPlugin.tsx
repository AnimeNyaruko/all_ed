import { createContext, useContext } from "react";
// Remove unused NodeKey import
// import type { NodeKey } from "lexical";

// Define the shape of the context data
export interface LatexPluginContextType {
	triggerMathfield: (nodeKey: string | null, initialLatex?: string) => void;
	activeMathLiveKey: string | null;
}

// Create the context with a default value
// The default trigger function does nothing, and active key is null
export const LatexPluginContext = createContext<LatexPluginContextType>({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	triggerMathfield: (nodeKey: string | null, initialLatex?: string) => {
		console.error("LatexPluginContext Provider not found");
	},
	activeMathLiveKey: null,
});

// Hook to easily use the context
export const useLatexPluginContext = () => useContext(LatexPluginContext);
