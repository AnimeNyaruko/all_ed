# Active Context: Assignment Submission Handler

## Current Focus

- Đã hoàn tất "re-update mode 2" với các cải tiến cho component `GoogleLoginButton.tsx` và cập nhật Memory Bank.
- Đã hoàn thành đầy đủ cả 4 bước của quy trình "re-update mode 2":
  1. Scan, Propose, Implement Changes
  2. Update Memory Bank
  3. Git Commit & Push
  4. Update version.json

## Current Work Focus

- Đảm bảo Memory Bank luôn là nguồn sự thật duy nhất, cập nhật ngay sau mỗi thay đổi lớn.
- Theo dõi các vấn đề còn lại chủ yếu về UI/UX (responsive, styling, MathLive initial display).
- Duy trì tối ưu hóa hiệu suất, kiểm thử đa thiết bị, versioning, audit trail.

## Recent Changes

- **Re-update Mode 2 (Đã hoàn tất):**
    - **Refactor `GoogleLoginButton.tsx`:**
        - Tạo hàm `handleLoginSuccess` để xử lý logic sau khi đăng nhập thành công, loại bỏ lặp code.
        - Tạo các hằng số `API_CHECK_EMAIL`, `API_COOKIE`, và `HOME_PATH` để dễ bảo trì.
        - Cải thiện xử lý lỗi với các thông báo chi tiết hơn.
        - Thêm block `try/catch` cho các API fetch để xử lý lỗi riêng biệt.
    - **Refactor Scroll Functions:**
        - Tạo file `utils/scrollUtils.ts`.
        - Di chuyển hàm `easeInOutQuad` vào `utils/scrollUtils.ts`.
        - Tạo hàm `scrollToElementById(elementId: string, duration: number = 800, offset: number = 0)` trong `utils/scrollUtils.ts`.
        - Cập nhật `ui/Components/Header.tsx` để `scrollToFooter` gọi `scrollToElementById('footer')`.
        - Cập nhật `app/page.tsx` để `scrollToFooter` gọi `scrollToElementById('features')`.
    - **Optimize `app/page.tsx`:**
        - Thay thế các emoji icons (🧠, 🎯, ✍️, 🤝, 💡, 📊, etc.) bằng SVG icons.
        - Đảm bảo các hình ảnh hiện có (nếu có và không bị comment) sử dụng `next/image` đúng cách (hiện tại các avatar testimonials đang được comment).
    - **Memory Bank:** Cập nhật đầy đủ các file Memory Bank để phản ánh những thay đổi trên.
    - **Linting:** Chạy `pnpm run lint` thành công mà không có lỗi.
    - **Git Operations:** Commit và push các thay đổi lên repository.
    - **Versioning:** Cập nhật `version.json` để cập nhật timestamp và commit message mới nhất cho phiên bản hiện tại (beta 1.4).
- **Trước đó (Carry-over from previous sessions):**
    - Đã tối ưu hóa component `Header.tsx`.
    - Triển khai hiển thị kết quả LaTeX trong `app/ketqua`.
    - Sửa lỗi API (`/api/nopbai/route.ts`) liên quan đến `JSON.parse` và tinh chỉnh prompt AI.
    - Cập nhật `app/lambai/(handler)/handler.ts` để bao bọc LaTeX.
    - Tối ưu hiệu năng resize bằng custom ghost drag.
    - Dọn dẹp lint.
    - Cải tiến trình soạn thảo LaTeX/MathLive (bao gồm fix vị trí MathLive, lưu/khôi phục newline, fix lỗi API, fix lỗi "Editor instance not found", fix "Click-to-Edit").

## Next Steps

- Tiếp tục kiểm thử đa thiết bị và responsive.
- Hoàn thiện styling cho `LatexNode` (background, border khi active/hovered).
- Giải quyết vấn đề MathLive initial display.
- Cân nhắc thay thế SVG placeholders trong `app/page.tsx` bằng icons chính thức nếu có.
- Tối ưu hóa `next/image` cho các hình ảnh (nếu cần).
- Sẵn sàng cho các yêu cầu tiếp theo.

## Active Decisions/Considerations

- Việc tách các section trong `app/page.tsx` đã được bỏ qua theo yêu cầu.
- SVG icons được sử dụng là placeholder, có thể cần cập nhật sau với thiết kế cụ thể.
- Tối ưu hóa `next/image` cho các avatar trong Testimonials sẽ được thực hiện nếu chúng được uncomment và sử dụng.
- Cải thiện xử lý lỗi trong `GoogleLoginButton.tsx` giúp người dùng hiểu rõ hơn về vấn đề khi đăng nhập thất bại.

## Current Issues

1.  **Editor Interactions:** Cursor/Selection behavior around `LatexNode` and newlines needs thorough testing.
2.  **Newline Saving:** Saving/Persistence of newlines within the Lexical editor state is unstable.
3.  **MathLive Positioning Regression:** The Portal fix resulted in the MathLive input being fixed at the bottom of the page, not near the active editor.
4.  **AI Prompt Compliance:** (Deferred) Need to test AI output formatting.

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

## Active Decisions/Considerations

- Ensuring type safety between components, especially for event handlers passed as props.

## Recent Changes

- Added `handleMathfieldKeyDown` function to `useMathLiveManager` hook.
- Included `handleMathfieldKeyDown` in the return object of `useMathLiveManager`.
- Resolved TypeScript error regarding `EventTarget` to `MathfieldElement` conversion using an intermediate `unknown` cast in `handleMathfieldKeyDown`.
- Verified all fixes by running `pnpm run lint`.

## Active Decisions/Considerations

- Using intermediate `unknown` casts for type assertions when direct casting or type guards fail to satisfy the linter, especially with complex external types like `EventTarget` or web components.

## Current Focus

- **Fixing Bug:** Address the "Editor instance not found in commitLatexToEditor" error that occurs when pressing Enter in the MathLive input if the Lexical editor hasn't been modified first.

## Recent Changes

- Modified `app/lambai/(UI)/editor/components/QuestionEditorInstance.tsx`:
  - Added an `EditorRefPlugin` component.
  - This plugin uses `useEffect` and `useLexicalComposerContext` to get the `LexicalEditor` instance upon initialization.
  - It immediately updates the `editorRefMap` passed down from `AnswerArea.tsx` with the editor instance.
  - Includes a cleanup function in `useEffect` to set the corresponding entry in `editorRefMap` back to `null` when the instance unmounts.
  - Adjusted the `useEffect` cleanup logic to satisfy the `react-hooks/exhaustive-deps` lint rule by storing `editorRefMap.current` in a local variable.
- Ensured `LatexPluginContext` is imported correctly, resolving a previous lint error (though its usage might be redundant now).

## Active Decisions & Considerations

- The root cause was identified as the `editorRefMap` not being populated with the editor instance until the `onChange` event fired. The fix ensures the map is updated upon component mount.
- The `LatexPluginContext` might be removable if all necessary props (`triggerMathfield`, `activeMathLiveKey`) are passed down directly, simplifying the structure. This can be reviewed later.

## Current Focus

- Observing editor interaction smoothness after fixing the main commit bug.

## Recent Changes

- **Bug Fix Confirmed:** The "Editor instance not found" error is resolved. Logs confirmed that `editorRefMap` is correctly populated when `commitLatexToEditor` is called, thanks to the `EditorRefPlugin`.
- **Removed Debug Logs:** Deleted `console.log` statements added previously for debugging the ref map issue.
- **Attempted Smoothness Optimization:** Removed the `setTimeout(..., 0)` wrapper around the state reset logic within `commitLatexToEditor` in `useMathLiveManager.ts`. The goal is to make the closing of MathLive and refocusing the editor feel more immediate.

## Active Decisions & Considerations

- The original bug was definitively related to the timing of `editorRefMap` population.
- The perceived lack of smoothness might be due to the slight delay introduced by `setTimeout` for state resets, which has now been removed for testing.

## Current Focus

- Verifying fix for the `ResizeObserver` error after reverting the `setTimeout` removal.

## Recent Changes

- **Bug Fix Confirmed (Previous):** The "Editor instance not found" error was resolved.
- **Attempted Smoothness Optimization Failed:** Removing `setTimeout(..., 0)` from `commitLatexToEditor` introduced a new runtime error: "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element'."
  - Stack trace indicated the error originated within Lexical's internal DOM update/selection logic (`$commitPendingUpdates`, `updateDOMSelection`).
  - Hypothesis: Removing the timeout caused a race condition or exposed an edge case in Lexical's internal observer handling during rapid state updates and focus shifts.
- **Reverted Optimization:** Re-added `setTimeout(..., 0)` around the state reset logic in `commitLatexToEditor` to resolve the `ResizeObserver` error.
- **LaTeX Click-to-Edit Fix (`app/lambai/(UI)/editor/hooks/useMathLiveManager.ts`):**
  - **Problem:** Khi người dùng nhấp vào một khối LaTeX hiện có để sửa, sau đó nhập liệu vào MathLive input, `editingNodeKey` bị xóa (set về `null`) ngay lập tức trong hàm `handleMathfieldInput`.
  - **Consequence:** Khi nhấn Enter để commit, `commitLatexToEditor` không nhận diện được đây là một thao tác sửa (vì `editingNodeKey` là `null`), dẫn đến việc thay đổi không được lưu hoặc hành vi sai lệch (ví dụ: cố gắng chèn node mới).
  - **Solution:** Xóa dòng `setEditingNodeKey((prev) => ({ ...prev, [key]: null }));` và `setEditingNodeKey` khỏi mảng phụ thuộc trong `handleMathfieldInput`.
  - **Result:** `editingNodeKey` được duy trì đúng cách trong suốt quá trình chỉnh sửa, cho phép `commitLatexToEditor` cập nhật chính xác node hiện có. Tính năng "Click-to-Edit" hoạt động trở lại.

## Active Decisions & Considerations

- Prioritized fixing the runtime error over the minor smoothness optimization.
- The interaction between immediate state updates, Lexical's internal reconciliation, and focus management appears sensitive.
- **Click-to-Edit Logic:** The fix in `handleMathfieldInput` ensures `editingNodeKey` is preserved correctly, which is crucial for distinguishing between creating a new LaTeX node and editing an existing one.

## Current Focus

- Completing `re-update mode 2` including Memory Bank update and Git operations.

## Recent Changes

- **Re-update Mode 2 - Linting & Optimization:**
  - **`app/lambai/(UI)/components/Tutorial.tsx` (Lint Fix):**
    - Resolved `react-hooks/exhaustive-deps` warning for `useEffect` handling Escape key.
    - Wrapped `openModal` and `closeModal` functions in `useCallback` with `onModalToggle` as a dependency.
    - Added the memoized `closeModal` to the `useEffect` dependency array.
  - **`app/lambai/(handler)/handler.ts` (Logic & Return Type Update):**
    - Modified `submitAnswers` server action:
      - It now returns an object `{ status: "success", submissionId: string }` upon successful API call to `/api/nopbai` and retrieval of `submissionId`.
      - Or returns `{ status: "error", message: string }` on failure.
      - Removed the direct `redirect("/ketqua")` call; redirection is now handled by the client based on the returned `submissionId`.
    - Modified `saveWorkProgress` server action:
      - Updated return type to `Promise<{ status: "success" | "error"; message?: string }>` for consistency.
      - Returns `{ status: "success" }` or `{ status: "error", message: "..." }`.
  - **`app/lambai/(UI)/lambai.tsx` (Optimization & Handler Update):**
    - `handleSubmit` function:
      - Updated to call the modified `submitAnswers` server action with all four required arguments: `timer`, `taskContent.de_bai`, `questions`, and `answersRef.current`.
      - Now correctly handles the new return object from `submitAnswers` to perform client-side redirection using `window.location.href = \`/ketqua?id=\${result.submissionId}\`;`.
      - Wrapped in `useCallback` with dependencies `[timer, taskContent.de_bai, questions]`.
    - `handleSaveProgress` function:
      - Updated to call the modified `saveWorkProgress` server action with `JSON.stringify(answersRef.current)` as the sole argument.
      - Now correctly handles the new return object.
      - Wrapped in `useCallback` with an empty dependency array `[]` as its core logic depends on refs and state setters.
    - `handleAnswersChange` function:
      - Remains wrapped in `useCallback` with `[handleSaveProgress]` as its dependency, ensuring it uses the memoized version of `handleSaveProgress`.
  - **Linting:** Ran `pnpm run lint` successfully after all changes, confirming no new lint errors or warnings were introduced.
- **Refactor (`lambai.tsx`):**
  - Extracted panel resizing logic (state, refs, handlers, effect) into a new custom hook `app/lambai/(UI)/hooks/usePanelResizer.ts`.

## Active Decisions & Considerations

- The refactoring improves the organization of `lambai.tsx` by encapsulating the resizing logic.
- The header toggle issue was caused by the initial height not being available when the first animation ran for new users.
- The fix ensures the initial state is correct (hidden) and animations run reliably from the first interaction.