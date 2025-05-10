# Progress

## What Works

- Toàn bộ route, page, API, component, hook, util, cấu hình, pattern đều đã được xác nhận hoạt động đúng và tổ chức rõ ràng.
- Core Lexical editor setup với nhiều instance (`QuestionEditorInstance`).
- MathLive integration cho LaTeX input (`<math-field>`).
- Custom `LatexNode` và `LatexComponent` cho rendering KaTeX.
- `LatexTriggerPlugin` (`!!`) và `MathShortcutPlugin` (`Ctrl+Q`) để khởi động MathLive.
- `useMathLiveManager` hook quản lý trạng thái MathLive (visibility, value, active key).
- `LatexPluginContext` hoặc prop drilling cho communication.
- `lexicalStateToAnswerBlocks` chuyển đổi editor state thành cấu trúc đơn giản.
- Layout với panel có thể resize (custom Ghost Drag).
- Left scrollbar (`direction: rtl/ltr` trick).
- Global scroll prevention.
- Conflict resolution cho single active MathLive input.
- Editor instance reference (`editorRefMap`) cập nhật ngay khi mount qua `EditorRefPlugin`.
- Performance optimizations: Memoization (`React.memo`, `useMemo`, `useCallback`) cho các component và hàm tính toán quan trọng.
- RESTful API động, xác thực NextAuth, middleware bảo vệ route, AI bot, versioning, audit trail.

## What's Left to Build / Fix

- **Responsive/cross-device:** Cần kiểm thử thực tế trên mobile/tablet.
- **Click-to-Edit:** Đang hoàn thiện.
- **Styling:** Thêm visual styling cho `LatexNode` (background, border khi active/hovered).
- **MathLive Initial Display:** Cần kiểm thử thêm (có thể liên quan đến overflow hoặc timing).

## Current Status

- **UI Adjustments (`app/lambai/(UI)/lambai.tsx`):**
  - Timer button CSS class logic fixed.
  - Content area height calculation adjusted for flexibility.
- **Linting Passed:** Code passes lint checks (no errors were found in this pass).
- **Refactor Complete:** Panel resizing logic in `lambai.tsx` has been extracted into the `usePanelResizer` hook.
- **Previous Fix Stable:** Header toggle arrow fix for new users is stable.
- **Ready for Git:** Codebase is ready for the commit and push stage of this `re-update mode 2` cycle.

## Known Issues

- Responsive/cross-device: Cần kiểm thử thực tế trên mobile/tablet.
- Click-to-edit: Đang hoàn thiện.
- Styling cho LatexNode: Đang hoàn thiện.
- MathLive initial display: Cần kiểm thử thêm.

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

## Next Steps

1. Tiếp tục kiểm thử đa thiết bị, responsive, UI/UX.
2. Hoàn thiện click-to-edit, styling cho LatexNode, MathLive initial display.
3. Duy trì tối ưu hóa hiệu suất, kiểm thử, versioning, audit trail.
4. Đảm bảo mọi thay đổi lớn đều cập nhật Memory Bank ngay lập tức.

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
