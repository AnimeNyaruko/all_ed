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
- Cải tiến UX cho user auth và mobile navigation thông qua transition và animation mượt mà trong `Header.tsx`.
- RESTful API động, xác thực NextAuth, middleware bảo vệ route, AI bot, versioning, audit trail.
- **Logic gọi Server Action (`handler.ts`, `lambai.tsx`):**
  - `submitAnswers` và `saveWorkProgress` trong `handler.ts` trả về kết quả có cấu trúc.
  - Client (`lambai.tsx`) gọi các server actions này và xử lý kết quả trả về.
- **Click-to-Edit LaTeX Blocks:** Hoạt động.
- **Linting:** Codebase vượt qua tất cả các kiểm tra lint.
- **Scroll Utility:**
    - Tạo `utils/scrollUtils.ts` với hàm `easeInOutQuad` và `scrollToElementById`.
    - `ui/Components/Header.tsx` và `app/page.tsx` sử dụng tiện ích cuộn này.
- **UI `app/page.tsx`:**
    - Emoji icons được thay thế bằng SVG icons.
- **Error handling và code organization:**
    - `GoogleLoginButton.tsx` với xử lý lỗi chi tiết và tổ chức code tốt hơn.
    - Sử dụng constants cho API URLs và đường dẫn.
    - Trích xuất logic lặp lại vào các hàm riêng biệt.

## What's Left to Build / Fix

- **Responsive/cross-device:** Cần kiểm thử thực tế trên mobile/tablet.
- **Styling:** Thêm visual styling cho `LatexNode` (background, border khi active/hovered).
- **MathLive Initial Display:** Cần kiểm thử thêm (có thể liên quan đến overflow hoặc timing).
- **SVG Icons in `app/page.tsx`**: Các SVG hiện tại là placeholder, cần được thay thế bằng icons chính thức nếu có.
- **`next/image` in `app/page.tsx`**: Kiểm tra và tối ưu hóa việc sử dụng `next/image` cho các hình ảnh (ví dụ: avatars trong Testimonials nếu chúng được uncomment).

## Current Status

- **Hoàn thành Bước 1 và một phần Bước 2 của "re-update mode 2" (Chu trình hiện tại):**
    - Refactor `GoogleLoginButton.tsx` để cải thiện tổ chức code và xử lý lỗi.
    - Refactor scroll functions và tối ưu hóa UI trong `app/page.tsx` đã hoàn tất.
    - `pnpm run lint` không có lỗi.
    - Đã cập nhật `activeContext.md` và `progress.md`.
- **Đang thực hiện Bước 2 của "re-update mode 2":** Hoàn tất cập nhật các file còn lại trong Memory Bank (`systemPatterns.md`, `techContext.md`).
- Sẵn sàng cho Bước 3 (Git Commit & Push) sau khi hoàn tất cập nhật Memory Bank.

## Known Issues

- Responsive/cross-device: Cần kiểm thử thực tế trên mobile/tablet.
- Styling cho LatexNode: Đang hoàn thiện.
- MathLive initial display: Cần kiểm thử thêm.
- SVG icons trong `app/page.tsx` là placeholders.

## Recently Completed (Reflects `activeContext.md`)

- **Re-update Mode 2 (Chu trình hiện tại) - Bước 1 & 2 (một phần):**
    - **Refactor `GoogleLoginButton.tsx`:**
        - Tạo hàm `handleLoginSuccess` để xử lý logic sau khi đăng nhập thành công.
        - Tạo constants cho API URLs và đường dẫn chuyển hướng.
        - Cải thiện xử lý lỗi với thông báo cụ thể hơn.
        - Thêm block try/catch cho các API fetch.
    - **Refactor Scroll Functions:**
        - Tạo `utils/scrollUtils.ts` với `easeInOutQuad` và `scrollToElementById`.
        - `ui/Components/Header.tsx` và `app/page.tsx` được cập nhật để sử dụng tiện ích này.
    - **Optimize `app/page.tsx`:**
        - Thay thế emoji icons bằng SVG icons (placeholders).
    - Chạy `pnpm run lint`: Không có lỗi mới.

- **Các thay đổi TRƯỚC ĐÓ (tóm tắt từ `activeContext.md`):**
    - Tối ưu hóa `Header.tsx`.
    - Tối ưu hóa `Tutorial.tsx` (lint fix).
    - Cập nhật logic và return type cho Server Actions trong `app/lambai/(handler)/handler.ts`.
    - Tối ưu hóa các hàm xử lý trong `app/lambai/(UI)/lambai.tsx`.
    - Sửa lỗi CSS cho timer button.
    - Refactor logic resize panel vào hook `usePanelResizer`.
    - Sửa lỗi header toggle arrow.
    - Các nỗ lực và giải pháp cho virtual keyboard enter.
    - Sửa lỗi Click-to-Edit LaTeX trong `useMathLiveManager.ts`.
    - Hoàn nguyên Portal cho MathLive, triển khai lưu/khôi phục newline, xử lý lỗi API, etc.

## Next Steps

1. Hoàn tất cập nhật Memory Bank.
2. Thực hiện Git commit và push.
3. Cập nhật `version.json`.
4. Tiếp tục kiểm thử đa thiết bị, responsive, UI/UX.
5. Hoàn thiện click-to-edit, styling cho LatexNode, MathLive initial display.
6. Thay thế SVG placeholders bằng icons chính thức.

## Testing Status

- Scroll functions refactored and tested.
- Emoji icons replaced with SVGs on `app/page.tsx`.
- **Các mục đã test trước đó:** Panel Resizing, Layout scrolling, `Ctrl+Q`, Single MathLive focus, Editor disabling, `!!` trigger, Physical Enter, Client-side parsing/rendering in `@ketqua`, Newline saving/restoration, API stability, Header Toggle Arrow, Click-to-Edit.
- **Linting:** All checks pass.
