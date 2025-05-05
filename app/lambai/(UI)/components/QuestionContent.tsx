"use client";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css"; // Import Katex CSS

// Tách phần nội dung MathJax thành component riêng
const QuestionContent = memo(
	({ markdownContent }: { markdownContent: string }) => {
		const content = useMemo(
			() => (
				<div
					className="space-y-4 text-gray-900"
					style={{
						overflowWrap: "anywhere",
						wordBreak: "break-word",
						direction: "ltr",
					}}
				>
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-bold">Đề bài</h2>
					</div>

					<ReactMarkdown
						components={{
							div: ({ ...props }) => (
								<div
									className="prose max-w-none"
									style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
									{...props}
								/>
							),
							p: ({ ...props }) => (
								<p
									style={{
										overflowWrap: "anywhere",
										whiteSpace: "pre-wrap",
										wordBreak: "break-word",
									}}
									{...props}
								/>
							),
							pre: ({ ...props }) => (
								<pre
									style={{
										whiteSpace: "pre-wrap",
										overflowWrap: "anywhere",
										wordBreak: "break-word",
										maxWidth: "100%",
									}}
									{...props}
								/>
							),
							code: ({
								...props
							}: {
								inline?: boolean;
								children?: React.ReactNode;
							}) => {
								const isInline = props.inline;
								return isInline ? (
									<code
										style={{
											overflowWrap: "anywhere",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
										}}
										{...props}
									/>
								) : (
									<code
										style={{
											display: "block",
											overflowWrap: "anywhere",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
										}}
										{...props}
									/>
								);
							},
							sub: ({ ...props }) => <sub {...props} />, // Ensure sub is handled if present
						}}
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex, rehypeRaw]}
					>
						{markdownContent}
					</ReactMarkdown>
				</div>
			),
			[markdownContent],
		);

		return content;
	},
);
QuestionContent.displayName = "QuestionContent";

export default QuestionContent;
