# Progress

## What Works

- Core Lexical editor setup with multiple instances (`QuestionEditorInstance`).
- MathLive integration for LaTeX input (`<math-field>`).
- Custom `LatexNode` and `LatexComponent` for rendering KaTeX.
- `LatexTriggerPlugin` (`!!`) and `MathShortcutPlugin` (`Ctrl+Q`) to initiate MathLive.
- `useMathLiveManager` hook manages MathLive state (visibility, value, active key).
- `LatexPluginContext` (potentially redundant) or direct prop drilling for communication.
- `lexicalStateToAnswerBlocks` converts editor state to a simplified structure.
- Layout with resizable panels using custom ghost drag logic.
- Left scrollbar (`direction: rtl/ltr` trick).
- Global scroll prevention.
- Conflict resolution for single active MathLive input.
- Editor instance reference (`editorRefMap`) is now updated immediately upon `QuestionEditorInstance` mount via `EditorRefPlugin`.

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
- **Linting Passed:** Code passes lint checks (no errors were found in this pass).
- **Refactor Complete:** Panel resizing logic in `lambai.tsx` has been extracted into the `usePanelResizer` hook.
- **Previous Fix Stable:** Header toggle arrow fix for new users is stable.
- **Ready for Git:** Codebase is ready for the commit and push stage of this `re-update mode 2` cycle.

## Known Issues

- **Smoothness:** Interaction might feel slightly less immediate due to the restored `setTimeout`.
- **Click-to-Edit:** Not fully implemented/verified.
- **Styling:** Visual styling for `LatexNode` is pending.
- **MathLive Initial Display:** Potential rendering issue due to parent overflow (requires testing).
- **`LatexPluginContext` Redundancy:** Context might be unnecessary.

## Recently Completed (Reflects `activeContext.md`)

1.  **UI/Layout Adjustments (`app/lambai/(UI)/lambai.tsx` - Update Mode):**
    - Fixed CSS class logic for the timer button.
    - Adjusted content area height calculation using `flex-grow`.
2.  **Refactor (`lambai.tsx`):** Extracted panel resizing logic into `usePanelResizer` hook.
3.  **Previous Fix (Header Toggle):** Corrected header toggle arrow behavior for new users.
4.  **Virtual Keyboard Enter Attempt (`onBeforeInput`)**: Thêm trình xử lý sự kiện `onBeforeInput` vào `math-field`.
5.  **Reverted Virtual Keyboard Command Customization:** Loại bỏ việc thay đổi `command` của keycap Enter ảo.
6.  **Removed `focusout` Logic:** Loại bỏ logic commit dựa trên sự kiện `focusout`.
7.  **Previous Refactoring:**
    - Hoàn nguyên Portal cho MathLive positioning.
    - Triển khai lưu/khôi phục newline.
    - Xử lý lỗi API và tinh chỉnh prompt.

## Next Steps (Immediate Tasks)

1.  **Test Virtual Keyboard Enter:** Mở MathLive, nhấn Enter ảo, kiểm tra console log cho `beforeinput triggered`, ghi lại `InputType` và `Data`.
2.  **Fix Virtual Enter Logic (If needed):** Nếu `inputType` không phải `insertLineBreak`, cập nhật điều kiện trong `handleMathfieldBeforeInput`.
3.  **Test Editor Interactions:** Kiểm tra kỹ lưỡng hành vi của con trỏ/selection sau khi Enter ảo hoạt động.
4.  **(Optional) Further AI Prompt Testing:** Giám sát đầu ra AI.
5.  **(Optional) Timer Persistence:** Giải quyết nếu cần.

## Upcoming / Longer Term

- [ ] Address MathLive initial display issue (overflow).
- [ ] Implement/Verify click-to-edit for `LatexNode`.
- [ ] Add visual styling for `LatexNode`.
- [ ] Refine error handling for MathLive loading and interaction.
- [ ] Optimize editor performance if necessary.

## Testing Status

- **Panel Resizing:** Refactored using `usePanelResizer` hook, basic functionality seems intact, needs testing.
- Layout scrolling seems fixed, needs more thorough testing.
- `Ctrl+Q` shortcut implemented, needs testing.
- Single MathLive focus/scroll logic implemented, needs testing.
- Editor disabling implemented, needs testing.
- `!!` trigger works.
- **Virtual Keyboard Enter:** Needs testing with `onBeforeInput`.
- Physical Enter key works.
- Click-to-Edit: Needs testing/implementation.
- Client-side parsing/rendering in `@ketqua` works.
- Newline saving and restoration works.
- API `/api/nopbai` JSON parsing and formatting seems stable.
- API `/api/taobai` JSON validity and Chem std cond seems stable.
- **Header Toggle Arrow:** Works correctly for new users after fix.
