# Progress

## What Works

- **Core Editor Structure:** Lexical editor (`AnswerArea.tsx`, `QuestionEditorInstance.tsx`) renders, manages multiple instances.
- **Basic LaTeX Rendering:** `LatexNode` and `LatexComponent` render existing LaTeX using `react-katex`.
- **LaTeX Input Trigger:** `!!` trigger (`LatexTriggerPlugin`) and `Ctrl+Q` (`MathShortcutPlugin`) successfully open the MathLive input field (`<math-field>`).
- **MathLive Input:** `<math-field>` component appears when triggered, allows LaTeX input.
- **Physical Keyboard Enter:** Pressing the physical Enter key while the `<math-field>` input is focused now correctly inserts/updates the `LatexNode` in the Lexical editor and closes the MathLive input (using `onKeyDown` and `commitLatexToEditor` with direct editor instance).
- **Context Handling:** `useLexicalComposerContext` is used correctly within the `EditorUIAndMathfield` inner component, resolving previous context errors.
- **State Management:** `useMathLiveManager` hook manages MathLive visibility, value, and active state.
- **Content Conversion:** `lexicalStateToAnswerBlocks` converts editor state correctly for parent components (including handling newlines).
- **Layout:** Resizable layout and scrolling generally work as intended.

## What's Left to Build / Fix

- **Virtual Keyboard Enter:** Pressing the Enter key _on the MathLive virtual keyboard_ needs to commit the LaTeX and close the input, mirroring the physical keyboard behavior.
- **Click-to-Edit LaTeX:** Functionality for clicking an existing rendered `LatexNode` to open the MathLive input for editing needs full implementation/verification (currently uses `triggerMathfield` but flow needs confirmation).
- **Visual Styling for `LatexNode`:** Add specific CSS (`.latex-node-class`) for better visual distinction of rendered LaTeX.

## Current Status

- **Enter Key:** Phím Enter vật lý hoạt động (sử dụng `onKeyDown`). Đã thêm trình xử lý `onBeforeInput` cho `<math-field>` để thử bắt Enter ảo. **Cần kiểm tra log console để xem `event.inputType` khi nhấn Enter ảo.**
- **Refactoring:** Đã ổn định sau nhiều lần tái cấu trúc (context, editor instance passing).

## Known Issues / Bugs

- **Virtual Keyboard Enter (Pending Test):** Chưa xác nhận hoạt động với `onBeforeInput`. Cần kiểm tra log.
- **Focusout Commit Edge Case:** (Không còn áp dụng - đã xóa bỏ logic `focusout`)
- **MathLive Initial Display (Low Priority now):** Vấn đề `overflow: hidden` ban đầu có thể vẫn còn.
- **Click-to-Edit (Not Tested/Implemented):** Chưa được kiểm tra hoặc triển khai đầy đủ.

## Recently Completed (Reflects `activeContext.md`)

1.  **Virtual Keyboard Enter Attempt (`onBeforeInput`)**: Thêm trình xử lý sự kiện `onBeforeInput` vào `math-field`.
2.  **Reverted Virtual Keyboard Command Customization:** Loại bỏ việc thay đổi `command` của keycap Enter ảo.
3.  **Removed `focusout` Logic:** Loại bỏ logic commit dựa trên sự kiện `focusout`.
4.  **Previous Refactoring:**
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
