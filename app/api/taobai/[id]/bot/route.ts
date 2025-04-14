import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/utils/googleAI";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
export async function POST(request: NextRequest) {
	const { _class, subject, prompt, level, username, assignmentId } =
		await request.json();
	const fixedPrompt = `**[SYSTEM PROMPT - STRICT ADHERENCE REQUIRED]**

**Objective:** Generate a **single, coherently integrated interdisciplinary exercise** (Math, Physics, Chemistry, Biology) formatted as a **pure, raw Markdown string**. This string must be directly usable as a value within a JSON object (e.g., '{"markdown_content": "OUTPUT_STRING_HERE"'}). The exercise will consist of a potential introductory context followed by numbered/lettered sub-questions (a, b, c,...). **Crucially, all mathematical formulas, equations, symbols, AND specific chemical notations MUST be formatted using appropriate LaTeX syntax.**

**Input Specification (User Provided):**
*   Up to 5 'Sets', each defining a component:
    *   'Set N:'
        *   'Class:' [Target Grade Level in Vietnam]
        *   'Subject:' [Math/Physics/Chemistry/Biology]
        *   'Level:' [Integer 1-8 (Difficulty Mapping: 1-2=Know, 3-4=Understand, 5-6=Apply, 7-8=High Apply)]
        *   'Prompt:' [Specific knowledge/skill/topic to incorporate]
*   **Internal Use Only:** The 'Subject' and 'Level' information from each Set is **only** for AI guidance during content generation and difficulty calibration. **It MUST NOT appear anywhere in the final output text.**

**Core Directives & Constraints (Non-Negotiable):**

1.  **Content Source:** **Strictly adhere** to the current Vietnamese **Ministry of Education and Training (MOET) curriculum and textbooks (SGK)** for the specified 'Class'.
2.  **Knowledge Integration:** The final exercise **must** logically synthesize and require application of knowledge/skills from **ALL** provided 'Sets'. Every 'Set' must demonstrably contribute to solving at least one sub-question.
3.  **Difficulty Matching:** The difficulty of sub-questions related to a specific 'Set' **must accurately reflect** the designated 'Level' (1-8) for that 'Set'. (Internal info only).
4.  **LaTeX Formatting (Mandatory):**
    *   **General Math:** **All** mathematical formulas, equations, variables (e.g., $x=5$), constants (e.g., $\\pi$), units (e.g., $m/s^2$), and symbols (e.g., $\\alpha, \\sum, \\int$) **must** be enclosed in appropriate LaTeX delimiters ('$...$' for inline, '$$...$$' for display). Ensure valid LaTeX syntax.
    *   **Chemical Reactions:**
        *   Use standard chemical formulas (e.g., $H_2O$, $Fe_2(SO_4)_3$).
        *   Use '\\rightarrow' or '\\rightleftharpoons' for reaction arrows.
        *   **CRITICAL: Reaction conditions** (temperature $t^\\circ$, catalyst $xt$, pressure $p$, etc.) **must** be placed **directly above** the reaction arrow using the LaTeX command '\\xrightarrow{conditions}'. Example: '2SO_2 + O_2 \\xrightarrow{V_2O_5, t^\\circ} 2SO_3$. **Do NOT** write conditions inline before/after the arrow or below it unless specifically required by chemical convention (rare).
5.  **Handling External Knowledge:** Only introduce concepts/formulas outside the standard SGK **if absolutely essential**. If used, **mandatorily** include '**Thông tin/Kiến thức tham khảo:**' at the **very end**, containing concise explanations/formulas (using LaTeX as needed). Omit if not needed.
6.  **Logical Flow:** Ensure context and sub-questions (a, b, c,...) are logically connected.

**Crucial Self-Correction / Final Polish (Mandatory Step Before Output):**
*   **Review:** Scan for accuracy, clarity, Vietnamese grammar.
*   **Verify Constraints:**
    *   Confirm **all** Sets represented.
    *   Check difficulty aligns with input 'Levels'.
    *   Ensure SGK adherence (or proper citation).
    *   **Validate LaTeX (General & Chemistry):**
        *   Check **all** math uses correct '$..$' or '$$..$$' and valid syntax.
        *   **Verify Chemical Reaction Formatting:** Confirm conditions are correctly placed *above* the arrow using '\\xrightarrow{conditions}' syntax. Ensure correct arrows ('\\rightarrow', '\\rightleftharpoons') are used.
    *   **Eliminate Metadata:** **CRITICAL:** Ensure **NO** traces of input Set information (like '(Hóa học - Mức độ 6)') are present next to question numbers or anywhere else.
    *   Eliminate unintended foreign words, placeholders, non-exercise content.
    *   Confirm strict compliance with **Output Format**.

**Output Format (ABSOLUTE REQUIREMENT - Pure Markdown String with LaTeX for JSON):**

*   **Deliver ONE single block of text.** Pure, raw Markdown with embedded LaTeX.
*   **Content:** Only include exercise context (optional) and sub-questions. Sub-questions start *only* with the letter/number (e.g., 'a. ', 'b. ') followed directly by the question text. If needed, the '**Thông tin/Kiến thức tham khảo:**' section appears last.
*   **Structure:** Basic Markdown syntax. Embed math **strictly** using '$inline$' and '$$display$$' LaTeX. Use '\\xrightarrow{conditions}' for reaction conditions above arrows.
*   **Forbidden Content:** **NO** introductory/concluding remarks, **NO** titles, **NO** JSON syntax, **NO** HTML tags, **NO** hidden notes. **ABSOLUTELY NO METADATA ANNOTATIONS**. **NO** improperly formatted chemical reactions (e.g., conditions not above the arrow). The output must be *only* the clean exercise text, ready for JSON injection. Ensure no unnecessary leading/trailing whitespace.

**[END SYSTEM PROMPT]**

---

**Thông tin đầu vào (Do người dùng cuối cung cấp):**
---
${_class.reduce((acc: string, curr: string, index: number) => {
	return `${acc}${index > 0 ? "\n" : ""}Set ${index + 1}: Class ${curr} - Subject: ${subject[index]} - Level: ${level[index]} - Prompt: ${prompt[index]}`;
}, "")}
---

**AI Task:** Proceed with generation based *strictly* on the directives above. Generate the pure Markdown exercise string with integrated LaTeX now.`;
	const result = await generateText(fixedPrompt);
	// console.log();
	const sanitizedUsername = sanitizeUsername(username);
	const query = `UPDATE "User Infomation"."${sanitizedUsername}" SET "task" = $1 WHERE "assignment_id" = $2`;
	await sql(query, [
		result!.split("markdown")[1].split("```")[0],
		assignmentId,
	]);

	return NextResponse.json(true);
}
