# Active Context: Assignment Submission Handler

## Current Focus

- Đã quét lại toàn bộ codebase, xác nhận và đồng bộ hóa Memory Bank với trạng thái thực tế của dự án.
- Đảm bảo mọi route, page, API, component, hook, util, cấu hình, pattern, tiến độ, vấn đề còn lại, quyết định kỹ thuật đều được phản ánh chính xác.

## Current Work Focus

- Đảm bảo Memory Bank luôn là nguồn sự thật duy nhất, cập nhật ngay sau mỗi thay đổi lớn.
- Theo dõi các vấn đề còn lại chủ yếu về UI/UX (responsive, click-to-edit, styling, MathLive initial display).
- Duy trì tối ưu hóa hiệu suất, kiểm thử đa thiết bị, versioning, audit trail.

## Recent Changes

- Đã hoàn thành tối ưu hóa hiệu suất (memoization, useMemo, useCallback) cho các component và hàm tính toán quan trọng.
- Đã xác nhận các route, page, API, component, hook, util đều được tổ chức rõ ràng, tuân thủ các pattern Next.js App Router, RESTful API, dynamic route, separation of concerns.
- Đã cập nhật các file cấu hình, versioning, middleware, xác thực, AI bot, tạo bài, nộp bài, xem kết quả.
- Đã cập nhật toàn bộ Memory Bank để phản ánh đúng thực trạng codebase.

## Active Decisions

- Memory Bank là nguồn sự thật duy nhất, mọi thay đổi lớn đều phải cập nhật ngay lập tức.
- Ưu tiên kiểm thử đa thiết bị, tối ưu hóa hiệu suất, versioning, audit trail.
- Tiếp tục hoàn thiện các vấn đề UI/UX còn lại (responsive, click-to-edit, styling, MathLive initial display).

## Current Issues

- Một số vấn đề UI/UX còn lại:
  - Responsive/cross-device: Cần kiểm thử thực tế trên mobile/tablet.
  - Click-to-edit: Đang hoàn thiện.
  - Styling cho LatexNode: Đang hoàn thiện.
  - MathLive initial display: Cần kiểm thử thêm.
- Các vấn đề về logic, API, xác thực, versioning, audit trail đã ổn định.

## Next Steps

1. Tiếp tục kiểm thử đa thiết bị, responsive, UI/UX.
2. Hoàn thiện click-to-edit, styling cho LatexNode, MathLive initial display.
3. Duy trì tối ưu hóa hiệu suất, kiểm thử, versioning, audit trail.
4. Đảm bảo mọi thay đổi lớn đều cập nhật Memory Bank ngay lập tức.

## Active Decisions & Considerations

- The fix ensures the initial state is correct (hidden) and animations run reliably from the first interaction.
- The refactoring (extraction of `usePanelResizer`) improves the organization of `lambai.tsx`.
- The header toggle issue (fixed in a prior mode) was due to initial height not being available for new users.

## Recent Changes

- **Bug Fix Confirmed:** The "Editor instance not found" error is resolved. Logs confirmed that `editorRefMap` is correctly populated when `commitLatexToEditor` is called, thanks to the `EditorRefPlugin`.

## Known Issues (Carried Over)

- **Smoothness:** Interaction might feel slightly less immediate due to the restored `setTimeout` in `useMathLiveManager`.
- **Click-to-Edit:** Not fully implemented/verified for `LatexNode`.
- **Styling:** Visual styling for `LatexNode` is pending.
- **MathLive Initial Display:** Potential rendering issue due to parent overflow (requires testing).
- **`LatexPluginContext` Redundancy:** Context might be unnecessary.
