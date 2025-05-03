# Active Context: Assignment Submission Handler

## Current Focus

Investigating and addressing the remaining issue in the `@lambai` editor: unstable newline saving.

## Recent Changes

1.  **Hiển thị Kết quả (`app/ketqua`)**
    - Triển khai hàm `utils/latexParser.ts` để phân tích chuỗi text chứa markup LaTeX (`$...$`).
    - Tạo component `app/ketqua/(UI)/MixedContentRenderer.tsx` để hiển thị nội dung hỗn hợp text/LaTeX, sử dụng `react-katex`.
    - Cập nhật `app/ketqua/(UI)/ResultPage.tsx` để sử dụng parser và renderer cho các trường `de_bai`, `subQuestion`, `userAnswer`, `correctAnswer`.
    - Đã sửa lỗi hiển thị xuống dòng không mong muốn bằng cách loại bỏ layout flexbox khỏi `MixedContentRenderer`.
2.  **API (`/api/nopbai/route.ts`)**
    - Sửa lỗi `JSON.parse` nghiêm trọng bằng cách parse kết quả AI và xây dựng đối tượng JSON hoàn chỉnh trước khi `stringify` để lưu vào DB.
    - Tinh chỉnh prompt cho AI nhiều lần để cải thiện việc quản lý xuống dòng (đặc biệt là `\n\n` trước mũi tên và tránh `\n` không cần thiết).
3.  **Gửi Bài (`app/lambai/(handler)/handler.ts`)**
    - Cập nhật hàm `answerBlocksToLatex` để tự động bao bọc các khối LaTeX bằng dấu `$` khi tạo chuỗi gửi đi.
4.  **Trước đó (Carry-over):**
    - Tối ưu hiệu năng resize bằng custom ghost drag.
    - Dọn dẹp lint.
    - Cải tiến trình soạn thảo LaTeX/MathLive.
    - Refactor layout sang CSS Grid.
5.  **MathLive Positioning Fix (`@lambai`)**
    - Hoàn nguyên việc sử dụng `ReactDOM.createPortal` cho `<math-field>` trong `QuestionEditorInstance.tsx`.
    - MathLive input giờ đây được render trực tiếp và định vị chính xác bên dưới trình soạn thảo tương ứng, không còn lỗi `position: fixed`.
    - Đã xác nhận lỗi clipping ban đầu không xuất hiện trở lại.

## Active Decisions

1.  **Prioritize Editor Stability:** Focus on fixing the newline saving issue.
2.  **Hiển thị Kết quả:** (Hold) Sử dụng phương pháp parsing và rendering ở client-side.
3.  **Định dạng AI Output:** (Hold) Tiếp tục tinh chỉnh prompt.
4.  **Tạo JSON Kết quả:** (Hold) Xây dựng đối tượng JS hoàn chỉnh.

## Current Issues

1.  **Newline Saving:** Saving/Persistence of newlines within the Lexical editor state is unstable.
2.  ~~**MathLive Positioning Regression:** The Portal fix resulted in the MathLive input being fixed at the bottom of the page, not near the active editor.~~ (Resolved)
3.  **AI Prompt Compliance:** (Deferred) Need to test AI output formatting.

## Next Steps

1.  **Investigate Newline Saving Issue:** Analyze Lexical state updates and persistence logic to find the cause of newline loss.
2.  ~~**Revisit MathLive Positioning:** Explore options: ...~~ (Resolved)
3.  **Test AI Output:** (Deferred) Verify `dap_an_dung` formatting.
4.  **Refine Prompt (If Needed):** (Deferred)
5.  **Test Editor Interactions (General):** (Deferred)

## Recent Feedback

- User xác nhận hướng đi sử dụng parser/renderer client-side cho trang kết quả.
- User xác nhận việc sửa lỗi JSON trong API.
- User yêu cầu các lần tinh chỉnh prompt AI về định dạng xuống dòng.

## Implementation Notes

- Parser: `utils/latexParser.ts`
- Renderer: `app/ketqua/(UI)/MixedContentRenderer.tsx`
- Trang kết quả: `app/ketqua/(UI)/ResultPage.tsx`
- API Endpoint: `app/api/nopbai/route.ts`

## Current Focus & Next Steps

**Focus:** Addressing critical editor issues: newline saving instability and MathLive positioning regression.

**Recent Changes:**

- Implemented `ReactDOM.createPortal` for MathLive (fixed clipping, but caused positioning regression). -> **Reverted**
- Verified click-to-edit.
- Added `LatexNode` styling.
- Identified newline saving instability.
- **Fixed MathLive Positioning:** Reverted Portal, MathLive now renders directly below the correct editor instance without clipping issues.

**Next Steps:**

1.  **Fix Newline Saving:** Investigate and resolve the unstable newline persistence.
2.  ~~**Fix MathLive Positioning:** Find a way to position the Portal correctly or replace the Portal approach.~~ (Resolved)
3.  **Test AI Output:** (Deferred)
4.  **Refine Prompt:** (Deferred)
5.  **Test Editor Interactions:** (Deferred)

**Active Considerations:**

- Root cause of newline saving issue.
- ~~Feasibility of dynamic Portal positioning vs. alternative clipping solutions.~~
- ~~Potential impact of reverting Portal on initial display.~~
