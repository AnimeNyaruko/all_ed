# Progress: Assignment Submission Handler

## What Works

### Core Functionality

1. **Server-Side**

   - [x] Task fetching from database
   - [x] Session management
   - [x] Cookie handling
   - [x] Basic error handling
   - [x] API `/api/nopbai` correctly parses AI response and creates valid JSON result string for DB.

2. **Client-Side Layout & Base UI**

   - [x] Split-pane layout (using CSS Grid)
   - [x] Independent panel scrolling (including left-side scrollbar)
   - [x] Responsive design basics
   - [x] Timer functionality (Start/Pause/Stop controls & display)
   - [x] Modern header
   - [x] Resizable left panel (using custom ghost drag logic - see System Patterns)

3. **Content Management & Math Editor**

   - [x] Markdown support (`react-markdown` in question view)
   - [x] Basic LaTeX math rendering (`rehype-katex` in question view)
   - [x] Lexical editor foundation (`AnswerArea.tsx`, `QuestionEditorInstance.tsx`)
   - [x] Custom `LatexNode` for representing LaTeX in Lexical.
   - [x] Inline rendering of `LatexNode` using `react-katex` (`LatexComponent`).
   - [x] External MathLive (`<math-field>`) integration for dedicated LaTeX input.
   - [x] `!!` trigger to open MathLive for inserting _new_ LaTeX nodes (`LatexTriggerPlugin`).
   - [x] `Ctrl+Q` shortcut trigger to open MathLive for inserting _new_ LaTeX nodes (`MathShortcutPlugin`).
   - [x] Single MathLive instance enforcement (scrolls & focuses existing if attempt to open another) (`useMathLiveManager`).
   - [x] Editor instance disabled (`readOnly`) while its MathLive input is active (`QuestionEditorInstance`).
   - [x] Editor placeholder updated with `!!` and `Ctrl+Q` instructions.
   - [x] Click-to-Edit: Verified existing implementation in `LatexComponent` correctly uses context to trigger edit.

4. **Result Display (`@ketqua`)**
   - [x] Fetches result data.
   - [x] Parses mixed text/LaTeX strings using `utils/latexParser.ts`.
   - [x] Renders mixed content correctly using `MixedContentRenderer` and `react-katex`.
   - [x] Applied parsing/rendering to `de_bai`, `subQuestion`, `userAnswer`, `correctAnswer`.
   - [x] Fixed premature text wrapping issue in rendered results.

## Recently Completed (Reflects `activeContext.md`)

1. **Math Editor Interaction Enhancements**

   - Added `Ctrl+Q` shortcut trigger.
   - Implemented single MathLive instance logic (focus/scroll existing).
   - Implemented editor disabling (`readOnly`) during MathLive input.
   - Updated editor placeholder text.

2. **Layout Refactor & Scrolling Fixes**

   - Replaced Flexbox with CSS Grid for main layout.
   - Implemented robust independent panel scrolling.
   - Implemented left-side scrollbar using `direction: rtl/ltr`.
   - Fixed page-level scrolling issues with global styles.

3. **Dependency Cleanup**

   - Removed several unused dependencies (listed in previous `progress.md`).

4. **Performance Optimization (Resize Lag)**

   - [x] Replaced `ResizableBox` with a custom drag handling mechanism.
   - [x] Implemented a "ghost bar" effect: Handle remains stationary during drag, only a visual indicator moves. Layout updates only on drag end (`mouseup`/`touchend`).
   - [x] Achieved smooth resizing performance even under heavy load conditions.

5. **Code Quality (Linting)**

   - [x] Removed unnecessary `eslint-disable` directives identified by the linter.
   - [x] Verified code passes `pnpm run lint` without errors or warnings.

6. **Result Display Implementation (`@ketqua`)**

   - [x] Implemented client-side parsing (`latexParser`) and rendering (`MixedContentRenderer`).
   - [x] Applied to all relevant fields (`de_bai`, `subQuestion`, `userAnswer`, `correctAnswer`).
   - [x] Fixed text wrapping issue.

7. **API Fix & Prompt Tuning (`/api/nopbai`)**

   - [x] Fixed JSON creation logic to prevent parsing errors on result page.
   - [x] Iteratively refined AI prompt to improve `dap_an_dung` formatting (newline management).

8. **Submission Formatting (`@lambai`)**

   - [x] Updated `answerBlocksToLatex` to wrap LaTeX parts with `$..$`.

9. **MathLive Positioning Fix (`@lambai`)**
   - [x] Hoàn nguyên việc sử dụng `ReactDOM.createPortal` cho `<math-field>`.
   - [x] `<math-field>` giờ đây được render trực tiếp trong `QuestionEditorInstance`, định vị chính xác bên dưới trình soạn thảo tương ứng.
   - [x] Xác nhận lỗi clipping ban đầu không xuất hiện lại sau khi hoàn nguyên.

## Known Issues / Items Requiring Verification

1. **AI Prompt Compliance:** Need to test if the latest prompt adjustments effectively control the AI's output format for `dap_an_dung` (newlines).
2. **Editor (`@lambai`) Issues (Needs Re-evaluation):**
   - [x] Click-to-Edit: Verified existing implementation.
   - [x] Visual Styling: Added border to default state in `LatexComponent` for better distinction.
   - [ ] Cursor/Selection: Robustness around `LatexNode` needs testing. (Deferred - See Next Steps)
   - [x] MathLive Initial Display: Fixed rendering issue using React Portal. MathLive input now appears correctly at the bottom of the screen when triggered. -> **Reverted Portal Implementation.**
   - [ ] **Newline Saving:** Saving/Persistence of newlines within the editor is currently unstable.
   - [x] ~~**MathLive Positioning Regression:** The Portal fix for initial display introduced an undesired fixed position at the bottom of the page. The input should ideally appear near the active editor instance.~~ (Resolved by reverting Portal)
   - [ ] Cursor/Selection: Robustness around `LatexNode` needs testing. (Deferred)
3. **Timer Persistence:** (Lower Priority)

## Next Steps (Immediate Tasks)

1. **Investigate Newline Saving Issue:** Determine the cause of unstable newline persistence in the Lexical editor state.
2. ~~**Revisit MathLive Positioning:** Find a solution to position the Portal-rendered MathLive input closer to the active editor, or revert/replace the Portal approach.~~ (Resolved)
3. **Test AI Output:** (Deferred) Submit a test assignment and verify the formatting of `dap_an_dung` in the `@ketqua` page.
4. **Refine Prompt (If Needed):** (Deferred) Adjust the prompt in `/api/nopbai` further based on test results.
5. **Test Editor Interactions (General):** (Deferred) Test cursor, selection, styling after addressing the primary issues.

## Upcoming / Longer Term

- [ ] Refine error handling for MathLive loading and interaction.
- [ ] Address Timer state persistence if required.
- [ ] Optimize editor performance if necessary.

## Testing Status

- Layout scrolling seems fixed, needs more thorough testing.
- `Ctrl+Q` shortcut implemented, needs testing.
- Single MathLive focus/scroll logic implemented, needs testing.
- Editor disabling implemented, needs testing.
- `!!`
- Client-side parsing/rendering in `@ketqua`
