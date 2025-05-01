# Active Context: Assignment Submission Handler

## Current Focus

Addressing the remaining functional issues in the LaTeX editor, specifically the initial MathLive display problem and click-to-edit functionality.

## Recent Changes

1.  **Performance Optimization (Resize Lag)**

    - Replaced `react-resizable` with a custom drag-handling mechanism built directly into the `lambai.tsx` component.
    - Implemented a "ghost bar" effect: The visible handle remains stationary during drag, while a visual indicator (`ghostLeft` state) tracks the potential position. The actual layout (`leftWidth` state controlling `gridTemplateColumns`) updates only on drag end (`mouseup`/`touchend`).
    - Utilized `useRef` (`dragStartXRef`, `startLeftWidthRef`, `ghostLeftRef`) to manage drag state and avoid stale state issues in event handlers.
    - Employed `useEffect` hook triggered by `isDragging` state to manage the addition and removal of global `mousemove`/`touchmove` and `mouseup`/`touchend` event listeners, ensuring timely listener management and cleanup.
    - Achieved smooth resizing performance, confirmed via testing under simulated heavy load and on mobile devices.

2.  **Code Quality (Linting)**

    - Ran `pnpm run lint` and identified several unused `eslint-disable` directives.
    - Removed these unnecessary directives from `route.ts`, `handler.ts`, `LatexPlugin.tsx`, and `Selection.tsx`.
    - Confirmed that `pnpm run lint` now passes without warnings or errors.

3.  **Previous Changes (Carry-over)**
    - LaTeX/MathLive enhancements (`Ctrl+Q`, single instance, editor disabling).
    - Layout refactor to CSS Grid, independent scrolling fixes.

## Active Decisions

1.  **Resizing Mechanism**

    - Abandoned `react-resizable` due to performance issues in the grid layout.
    - Adopted a custom "ghost drag" implementation for optimal performance and UX.
    - Event listeners (`mousedown`/`touchstart`) are attached directly to the handle `div`.
    - Global listeners for move/end events are managed via `useEffect` and `isDragging` state.

2.  **Linting**

    - Removed confirmed unused `eslint-disable` directives.
    - Continue to run `pnpm run lint` after significant changes.

3.  **Layout & Styling (Unchanged from previous)**
    - CSS Grid for main layout.
    - Independent Scrolling patterns.
    - Left Scrollbar technique.

## Current Issues

1.  **Under Investigation / To Implement**

    - **MathLive Initial Display:** (Top Priority) The `<math-field>` component fails to render initially when triggered due to `overflow: hidden` on parent containers in `lambai.tsx`. Needs CSS solution (Positioning/Z-index, Portal, or Layout Refactor).
    - **Click-to-Edit:** Functionality for editing existing `LatexNode`s by clicking them.
    - Visual styling for `LatexNode`.
    - Robustness of cursor positioning/selection around `LatexNode`s.

2.  **Known Issues (Lower Priority)**
    - Timer state persistence.

## Next Steps

1.  **Immediate Tasks**

    - **Fix MathLive Initial Display:** Investigate CSS solutions (Positioning/Z-index, Portal, Layout structure) to allow MathLive to appear correctly despite `overflow: hidden`.
    - Implement click-to-edit for existing `LatexNode`s.
    - Add visual styling to `LatexNode`.

2.  **Testing**
    - Thoroughly test the MathLive display fix and click-to-edit functionality.
    - Perform regression testing on core editor features.

## Recent Feedback

- User confirmed custom ghost drag logic resolved the resize lag effectively.
- User confirmed the need to address MathLive initial display issue next.

## Implementation Notes

- Resizing Logic: Implemented directly in `app/lambai/(UI)/lambai.tsx` using state, refs, and event listeners.
- Next focus: CSS issues in `lambai.tsx` related to `overflow: hidden` and potentially `QuestionEditorInstance.tsx` or `useMathLiveManager.ts` for click-to-edit.
