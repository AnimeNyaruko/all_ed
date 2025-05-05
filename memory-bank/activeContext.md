# Active Context: Assignment Submission Handler

## Current Focus

Testing editor stability and interactions, particularly cursor behavior and selection around `LatexNode` and paragraph breaks, following the implementation of newline handling.

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
    - Hoàn nguyên việc sử dụng `ReactDOM.createPortal` cho `<math-field>`.
    - MathLive input giờ đây được render trực tiếp và định vị chính xác.
6.  **Newline Saving/Restoration (`@lambai`)**
    - Cập nhật `lexicalStateToAnswerBlocks` trong `AnswerArea.tsx` để chèn `\n` giữa các đoạn.
    - Cập nhật `InitialContentPlugin.tsx` để tái tạo các đoạn từ `\n` khi khôi phục.
7.  **API Error Handling & Prompt Refinement (`/api/nopbai`)**
    - Sửa lỗi `JSON.parse` (escape backslash, newline thực tế).
    - Sửa lỗi định dạng đơn vị (`%...%`).
    - Yêu cầu AI chỉ trả về kết quả cuối cùng.
    - Yêu cầu AI bao quanh LaTeX/công thức bằng `$ ... $`.
    - Cải thiện định dạng prompt.
8.  **API Error Handling & Prompt Refinement (`/api/taobai`)**
    - Sửa lỗi `JSON.parse` phía client (trả về chuỗi JSON chuẩn, không escape `\"`).
    - Thêm quy tắc 24.79 L/mol cho môn Hóa.
    - Cải thiện định dạng prompt.

## Active Decisions

1.  **Prioritize Editor Testing:** Focus on verifying editor interactions after recent changes.
2.  **Monitor AI Formatting:** Observe AI output for potential regressions or edge cases.
3.  **API Stability:** Assume API parsing/formatting issues are resolved unless new problems arise.

## Current Issues

1.  **Editor Interactions:** Cursor/Selection behavior around `LatexNode` and newlines needs thorough testing.
2.  **Newline Saving:** Saving/Persistence of newlines within the Lexical editor state is unstable.
3.  **MathLive Positioning Regression:** The Portal fix resulted in the MathLive input being fixed at the bottom of the page, not near the active editor.
4.  **AI Prompt Compliance:** (Deferred) Need to test AI output formatting.

## Next Steps

1.  **Test Editor Interactions:** Thoroughly test cursor behavior, selection, deletion, copy/paste, etc., focusing on scenarios involving `LatexNode` and paragraph breaks.
2.  **Monitor AI Output:** (Ongoing) Observe results from both APIs for formatting consistency.
3.  **(Optional) Timer Persistence:** Address if necessary.

## Recent Feedback

- User xác nhận các lỗi API và yêu cầu các lần tinh chỉnh prompt.
- User yêu cầu triển khai lưu/khôi phục newline.

## Implementation Notes

- Editor state conversion: `AnswerArea.tsx` (`lexicalStateToAnswerBlocks`)
- Editor state restoration: `app/lambai/(UI)/editor/plugins/InitialContentPlugin.tsx`
- API Endpoints: `/api/nopbai/route.ts`, `/api/taobai/[id]/bot/route.ts`

## Current Focus & Next Steps

**Focus:** Verifying editor stability and interactions (cursor, selection) after newline implementation.

**Recent Changes:**

- Fixed MathLive positioning (reverted Portal).
- Implemented newline saving/restoration.
- Resolved API JSON parsing errors (`/api/nopbai`, `/api/taobai`).
- Refined API prompts for formatting (units, LaTeX wrapping, final results, newlines, Chem std cond).

**Next Steps:**

1.  **Test Editor Interactions (High Priority).**
2.  Monitor AI Output (Ongoing).
3.  Address Timer Persistence (Optional/Low Priority).

**Active Considerations:**

- Potential edge cases in editor interaction with mixed content and newlines.

## Current Focus

- **Finalizing Editor Fixes & Testing:** Hoàn thiện các chỉnh sửa cho trình soạn thảo, đặc biệt là hành vi của phím Enter ảo, và tiến hành kiểm thử.

## Recent Changes & Decisions (Virtual Keyboard Enter Fix)

- **Physical Enter:** Hoạt động chính xác thông qua sự kiện `onKeyDown` trên `<math-field>` và hàm `handleMathfieldKeyDown` trong hook `useMathLiveManager` (truyền trực tiếp editor instance).
- **Virtual Enter Solution:**
  - **Hoàn nguyên Command:** Xóa bỏ việc tùy chỉnh `command` cho keycap `[return]` trên bàn phím ảo. Để MathLive xử lý hành động mặc định.
  - **Sử Dụng `focusout`:** Tận dụng sự kiện `focusout` được kích hoạt khi bàn phím ảo đóng lại sau khi nhấn Enter.
  - **Logic trong `handleFocusOut` (`QuestionEditorInstance.tsx`):**
    - Sử dụng `setTimeout` để trì hoãn xử lý một chút.
    - Kiểm tra xem focus có bị mất khỏi `<math-field>` hiện tại và _không_ chuyển sang một `<math-field>` khác hay không.
    - Nếu điều kiện đúng và ô input có giá trị, gọi hàm `commitLatexToEditorFunc` (trỏ đến `commitLatexToEditor` trong hook) để commit giá trị.
    - Hàm `commitLatexToEditor` trong hook sẽ lấy editor instance từ `editorRefMap` và cập nhật Lexical state, đồng thời reset các trạng thái liên quan.
- **Previous Failed Attempts:** Các phương pháp sử dụng `onChange`, `beforeinput`, dispatch sự kiện tùy chỉnh, hoặc phát hiện dummy text trong `onInput`/`onChange` đều không thành công hoặc không đáng tin cậy.
- **Refactoring:** Đã tái cấu trúc `QuestionEditorInstance` để giải quyết lỗi context và điều chỉnh cách truyền editor instance.
- **Global Keyboard Object:** Đã xác định và sử dụng đúng đối tượng global `window.mathVirtualKeyboard` thay vì import sai.

## Next Steps & Considerations

- **Test Virtual Enter:** Kiểm tra xem trình xử lý `onBeforeInput` mới thêm vào `<math-field>` có bắt được sự kiện Enter của bàn phím ảo hay không. Quan sát console log để xác định `event.inputType` và `event.data` tương ứng.
- **Clean up:** Xóa bỏ các `console.log` gỡ lỗi sau khi xác nhận chức năng.
- **Testing:** Kiểm thử kỹ lưỡng cả Enter vật lý và Enter ảo trên nhiều trình duyệt/thiết bị (nếu có thể) sau khi Enter ảo hoạt động.
- **Edge Cases:** Xem xét trường hợp người dùng click ra ngoài thay vì nhấn Enter ảo.
- **Memory Bank Update:** Cập nhật `progress.md`.

## Open Questions / Blockers

- (Pending Test) `event.inputType` nào được gửi bởi Enter của bàn phím ảo?

## Current State

- Đã thêm trình xử lý sự kiện `onBeforeInput` vào `<math-field>` để cố gắng bắt sự kiện Enter của bàn phím ảo.
- Phím Enter vật lý hoạt động chính xác.
- Cần kiểm tra kết quả của việc nhấn Enter ảo và xem log console.
