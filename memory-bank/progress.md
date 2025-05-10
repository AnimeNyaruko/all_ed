# Progress

## What Works

- Core Lexical editor setup with multiple instances (`QuestionEditorInstance`).
- MathLive integration for LaTeX input (`<math-field>`).
- Custom `LatexNode` and `LatexComponent` for rendering KaTeX.
- `LatexTriggerPlugin` (`!!`) and `MathShortcutPlugin` (`Ctrl+Q`) to initiate MathLive.
- `useMathLiveManager` hook manages MathLive state (visibility, value, active key).
- Editor instance reference (`editorRefMap`) is now updated immediately upon `QuestionEditorInstance` mount via `EditorRefPlugin`.
- Layout with resizable panels using custom ghost drag logic (extracted to `usePanelResizer` hook).
- Left scrollbar (`direction: rtl/ltr` trick).
- Global scroll prevention.
- Conflict resolution for single active MathLive input.
- `LatexPluginContext` (potentially redundant) or direct prop drilling for communication.
- `lexicalStateToAnswerBlocks` converts editor state to a simplified structure.

## What's Left to Build / Fix

- **Verify Fix:** Confirm that the "Editor instance not found" error is resolved by testing the specific scenario.
- **Click-to-Edit:** Full verification/implementation needed for clicking existing `LatexNode`s to edit them in MathLive.
- **Styling:** Add visual styling for `LatexNode` (e.g., background, border when active/hovered).
- **Initial Display:** Address the original MathLive rendering issue if it persists (might be related to `overflow: hidden` or timing).
- **Context Cleanup:** Review if `LatexPluginContext` can be removed in favor of prop drilling managed by `useMathLiveManager`.

## Current Status

- **UI Adjustments (`app/lambai/(UI)/lambai.tsx`):**
  - Timer button CSS class logic fixed.
  - Content area height calculation adjusted for flexibility.
- **Refactor Complete:** Panel resizing logic in `lambai.tsx` has been extracted into the `usePanelResizer` hook.
- **Linting Passed:** Code passes lint checks. Linting passed successfully after fixes.
- **Previous Fix Stable:** Header toggle arrow fix for new users is stable.
- **Ready for Git:** Codebase is ready for the commit and push stage of this update cycle.

## Known Issues

- **Smoothness:** Interaction might feel slightly less immediate due to the restored `setTimeout`.
- **Click-to-Edit:** Not fully implemented/verified.
- **Styling:** Visual styling for `LatexNode` is pending.
- **MathLive Initial Display:** Potential rendering issue due to parent overflow (requires testing).
- **`LatexPluginContext` Redundancy:** Context might be unnecessary.

## Recently Completed

1.  **UI/Layout Adjustments (`app/lambai/(UI)/lambai.tsx`):**
    - Fixed CSS class logic for the timer button.
    - Adjusted content area height calculation using `flex-grow`.
2.  **Refactor (`lambai.tsx`):** Extracted panel resizing logic into `usePanelResizer` hook.
3.  **Lint Fixes:** Applied lint fixes to `app/ve-chung-toi/page.tsx`.
4.  **Previous Fix (Header Toggle):** Corrected header toggle arrow behavior for new users.
5.  **Previous Editor Bug Fixes & Refinements.**

## Next Steps (Immediate Tasks)

1.  Draft Git commit message.
2.  Present commit message for approval.
3.  Push to repository.
4.  Update `version.json`.

## Upcoming / Longer Term

- [ ] Address MathLive initial display issue (overflow).
- [ ] Implement/Verify click-to-edit for `LatexNode`.
- [ ] Add visual styling for `LatexNode`.
- [ ] Refine error handling for MathLive loading and interaction.
- [ ] Optimize editor performance if necessary.

## Testing Status

- **Panel Resizing:** Refactored using `usePanelResizer` hook, basic functionality seems intact.
- Layout scrolling seems fixed.
- `Ctrl+Q` shortcut implemented.
- Single MathLive focus/scroll logic implemented.
- Editor disabling implemented.
- `!!` trigger works.
- Physical Enter key works.
- Client-side parsing/rendering in `@ketqua` works.
- Newline saving and restoration works.
- API `/api/nopbai` JSON parsing and formatting seems stable.
- API `/api/taobai` JSON validity and Chem std cond seems stable.
- **Header Toggle Arrow:** Works correctly for new users after fix.
- **Linting:** All checks pass.
- **Virtual Keyboard Enter:** Needs testing with `onBeforeInput`.
- Click-to-Edit: Needs testing/implementation.
