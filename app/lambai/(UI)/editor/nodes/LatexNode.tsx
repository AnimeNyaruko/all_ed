import type {
	EditorConfig,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode,
	Spread,
} from "lexical";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import React, { Suspense } from "react";

const LatexComponent = React.lazy(() => import("../components/LatexComponent"));

export type SerializedLatexNode = Spread<
	{ latex: string },
	SerializedLexicalNode
>;

export class LatexNode extends DecoratorNode<React.JSX.Element> {
	__latex: string;

	static getType(): string {
		return "latex";
	}

	static clone(node: LatexNode): LatexNode {
		return new LatexNode(node.__latex, node.__key);
	}

	static importJSON(serializedNode: SerializedLatexNode): LatexNode {
		const node = $createLatexNode(serializedNode.latex);
		return node;
	}

	constructor(latex: string, key?: NodeKey) {
		super(key);
		this.__latex = latex;
	}

	exportJSON(): SerializedLatexNode {
		return {
			latex: this.__latex,
			type: "latex",
			version: 1,
		};
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = document.createElement("span");
		const theme = config.theme;
		const className = theme.latex; // Assuming you'll add a 'latex' class to your theme
		if (className !== undefined) {
			element.className = className;
		}
		return element;
	}

	updateDOM(): false {
		return false;
	}

	getLatex(): string {
		return this.__latex;
	}

	setLatex(latex: string): void {
		const writable = this.getWritable();
		writable.__latex = latex;
	}

	decorate(): React.JSX.Element {
		return (
			<Suspense fallback={null}>
				<LatexComponent latex={this.__latex} nodeKey={this.getKey()} />
			</Suspense>
		);
	}

	isInline(): true {
		return true;
	}
}

export function $createLatexNode(latex: string): LatexNode {
	return $applyNodeReplacement(new LatexNode(latex));
}

export function $isLatexNode(
	node: LexicalNode | null | undefined,
): node is LatexNode {
	return node instanceof LatexNode;
}
