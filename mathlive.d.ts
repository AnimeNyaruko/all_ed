// mathlive.d.ts
declare namespace JSX {
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
				// Add other props based on MathLive documentation
			},
			HTMLElement
		>;
	}
}
