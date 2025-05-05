# Active Context: Assignment Submission Handler

## Current Focus

Testing editor stability and interactions, particularly cursor behavior and selection around `LatexNode` and paragraph breaks, following the implementation of newline handling.

## Current Work Focus

- Addressing residual lint errors related to type assertions and hook return values.

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

- Removed conflicting `interface Window` declaration in `app/lambai/(UI)/AnswerArea.tsx`.
- Added missing `handleMathfieldKeyDown` prop to `QuestionEditorInstanceProps` in `app/lambai/(UI)/editor/components/QuestionEditorInstance.tsx`.
- Verified fixes by running `pnpm run lint`.

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

## Active Decisions/Considerations

- Ensuring type safety between components, especially for event handlers passed as props.

## Recent Changes

- Added `handleMathfieldKeyDown` function to `useMathLiveManager` hook.
- Included `handleMathfieldKeyDown` in the return object of `useMathLiveManager`.
- Resolved TypeScript error regarding `EventTarget` to `MathfieldElement` conversion using an intermediate `unknown` cast in `handleMathfieldKeyDown`.
- Verified all fixes by running `pnpm run lint`.

## Next Steps

- Continue addressing known issues, likely starting with the MathLive initial display problem.
- Or, proceed with the next task as directed.

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

## Next Steps

- Verify the fix by testing the scenario: open MathLive, type LaTeX, press Enter _without_ previously typing in the Lexical editor.
- Proceed with `re-update mode 2` or other tasks as directed.

## Active Decisions & Considerations

- The root cause was identified as the `editorRefMap` not being populated with the editor instance until the `onChange` event fired. The fix ensures the map is updated upon component mount.
- The `LatexPluginContext` might be removable if all necessary props (`triggerMathfield`, `activeMathLiveKey`) are passed down directly, simplifying the structure. This can be reviewed later.

## Current Focus

- Observing editor interaction smoothness after fixing the main commit bug.

## Recent Changes

- **Bug Fix Confirmed:** The "Editor instance not found" error is resolved. Logs confirmed that `editorRefMap` is correctly populated when `commitLatexToEditor` is called, thanks to the `EditorRefPlugin`.
- **Removed Debug Logs:** Deleted `console.log` statements added previously for debugging the ref map issue.
- **Attempted Smoothness Optimization:** Removed the `setTimeout(..., 0)` wrapper around the state reset logic within `commitLatexToEditor` in `useMathLiveManager.ts`. The goal is to make the closing of MathLive and refocusing the editor feel more immediate.

## Next Steps

- User to test the commit interaction again to evaluate if removing `setTimeout` improved the perceived smoothness.
- Address other pending issues (Click-to-Edit, Styling, Initial Display) or proceed with new tasks.

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

## Next Steps

- User to test the commit interaction again to confirm the `ResizeObserver` error is gone.
- Assess if the slight lack of smoothness (due to `setTimeout`) is acceptable.
- Proceed with other pending tasks.

## Active Decisions & Considerations

- Prioritized fixing the runtime error over the minor smoothness optimization.
- The interaction between immediate state updates, Lexical's internal reconciliation, and focus management appears sensitive.

## Current Focus

- Completing `re-update mode 2` including Memory Bank update and Git operations.

## Recent Changes

- **Refactor (`lambai.tsx`):** Extracted the `QuestionContent` component into its own file (`app/lambai/(UI)/components/QuestionContent.tsx`) and imported it back into `lambai.tsx`.
- **Refactor (`AnswerArea.tsx`):**
  - Moved the `lexicalStateToAnswerBlocks` utility function to a new file (`app/lambai/(UI)/editor/utils/lexicalUtils.ts`).
  - Imported the utility function back into `AnswerArea.tsx`.
  - Moved `editorTheme` definition and `onError` function inside the `AnswerArea` component scope.
- **Optimize (`QuestionEditorInstance.tsx`):**
  - Extracted the `EditorUIAndMathfield` inner component to the file level.
  - Applied `React.memo` to `EditorUIAndMathfield`.
  - Created a separate `EditorUIAndMathfieldProps` interface containing only the props needed by the child component.
  - Updated `QuestionEditorInstance` to use the memoized child component and pass the correct props.
- **Linting:** Fixed various lint errors that occurred during refactoring (missing imports, incorrect props).
- **Previous Bug Fixes:** Resolved "Editor instance not found" and reverted the change that caused the "ResizeObserver" error.

## Next Steps

- Update other Memory Bank files (`progress.md`, etc.).
- Proceed to Git commit and push for the handle fix.
- Update `version.json` for the current version (`beta 1.3`).

## Active Decisions & Considerations

- The refactoring aims to improve code organization, readability, and potential reusability.
- Memoizing `EditorUIAndMathfield` might offer minor performance benefits in lists.
- Keeping `editorTheme` and `onError` scoped within `AnswerArea` for now.
- The handle overlapping issue was confirmed to be a CSS positioning context problem.
- Decided against further refactoring in this cycle to focus on updating the version with the fix.
