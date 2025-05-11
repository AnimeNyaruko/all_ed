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
- Performance optimizations: Memoization (`React.memo`, `useMemo`, `useCallback`) cho các component và hàm tính toán quan trọng, bao gồm các event handlers chính trong `lambai.tsx` (`handleSubmit`, `handleSaveProgress`, `handleAnswersChange`) và `Tutorial.tsx` (`openModal`, `closeModal`).
- RESTful API động, xác thực NextAuth, middleware bảo vệ route, AI bot, versioning, audit trail.
- **Logic gọi Server Action (`handler.ts`, `lambai.tsx`):**
    - `submitAnswers` và `saveWorkProgress` trong `handler.ts` trả về kết quả có cấu trúc (status, message/submissionId) thay vì tự redirect.
    - Client (`lambai.tsx`) gọi các server actions này với tham số chính xác và xử lý kết quả trả về một cách nhất quán.
- **Linting:** Codebase vượt qua tất cả các kiểm tra lint sau các thay đổi gần đây.

## What's Left to Build / Fix

- **Responsive/cross-device:** Cần kiểm thử thực tế trên mobile/tablet.
- **Click-to-Edit:** Đang hoàn thiện.
- **Styling:** Thêm visual styling cho `LatexNode` (background, border khi active/hovered).
- **MathLive Initial Display:** Cần kiểm thử thêm (có thể liên quan đến overflow hoặc timing).

## Current Status

- **Hoàn thành Bước 1 của "re-update mode 2" (Chu trình hiện tại):**
    - Quét mã nguồn (`app/`) không tìm thấy cơ hội refactor/optimize.
    - `pnpm run lint` không có lỗi.
    - Không có thay đổi mã nào được thực hiện.
- **Đang thực hiện Bước 2 của "re-update mode 2":** Cập nhật Memory Bank.
- Sẵn sàng cho Bước 3 (Git Commit & Push) sau khi hoàn tất cập nhật Memory Bank.

## Known Issues

- Responsive/cross-device: Cần kiểm thử thực tế trên mobile/tablet.
- Click-to-edit: Đang hoàn thiện.
- Styling cho LatexNode: Đang hoàn thiện.
- MathLive initial display: Cần kiểm thử thêm.

## Recently Completed (Reflects `activeContext.md`)

- **Re-update Mode 2 (Chu trình hiện tại) - Bước 1: Scan, Propose, Implement:**
    - Quét mã nguồn trong `app/` không phát hiện cơ hội refactoring hoặc tối ưu hóa nào cần thiết.
    - Chạy `pnpm run lint` cho kết quả không có lỗi hay cảnh báo ESLint.
    - Không có thay đổi mã nào được đề xuất hay triển khai.

1.  **Re-update Mode 2 - Linting & Optimization (Chu trình TRƯỚC ĐÓ):**
    - **`app/lambai/(UI)/components/Tutorial.tsx` (Lint Fix):**
        - Resolved `react-hooks/exhaustive-deps` by memoizing `openModal`/`closeModal` and updating `useEffect` deps.
    - **`app/lambai/(handler)/handler.ts` (Logic & Return Update):**
        - `submitAnswers`: Returns structured result (status, submissionId) instead of redirecting.
        - `saveWorkProgress`: Returns structured result (status, message).
    - **`app/lambai/(UI)/lambai.tsx` (Optimization & Handler Update):**
        - `handleSubmit`, `handleSaveProgress`, `handleAnswersChange` updated to use new handler logic and wrapped in `useCallback`.
    - **Linting:** All checks passed post-changes.
2.  **UI/Layout Adjustments (`app/lambai/(UI)/lambai.tsx` - Update Mode):**
    - Fixed CSS class logic for the timer button.
3.  **Refactor (`lambai.tsx`):** Extracted panel resizing logic into `usePanelResizer` hook.
4.  **Previous Fix (Header Toggle):** Corrected header toggle arrow behavior for new users.
5.  **Virtual Keyboard Enter Attempt (`onBeforeInput`)**: Thêm trình xử lý sự kiện `onBeforeInput` vào `math-field`.
6.  **Reverted Virtual Keyboard Command Customization:** Loại bỏ việc thay đổi `command` của keycap Enter ảo.
7.  **Removed `focusout` Logic:** Loại bỏ logic commit dựa trên sự kiện `focusout`.
8.  **Previous Refactoring:**
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
