# Active Context: Assignment Submission Handler

## Current Focus

Refining the user interaction patterns for LaTeX editing and ensuring the layout behaves robustly.

## Recent Changes

1.  **LaTeX/MathLive Enhancements (`useMathLiveManager`, `plugins`, `QuestionEditorInstance`)**

    - Added `Ctrl+Q` keyboard shortcut (via `MathShortcutPlugin`) as an alternative to `!!` for triggering the MathLive input. Handles selection removal like `!!`.
    - Implemented single MathLive instance logic: Attempting to trigger MathLive (via `!!` or `Ctrl+Q`) when another instance is already active will now scroll to and **focus** the active MathLive input instead of opening a new one. (`useMathLiveManager`)
    - Disabled the Lexical editor instance (`ContentEditable` set to `readOnly`) while its corresponding MathLive input is visible. (`QuestionEditorInstance`)
    - Updated editor placeholder text to include both `!!` and `Ctrl+Q` instructions. (`QuestionEditorInstance`)

2.  **Layout & Scrolling Fixes (`lambai.tsx`, `ui/Style/index.css`)**

    - Replaced the main content area's Flexbox layout with CSS Grid (`gridTemplateColumns`, explicit grid container height, `overflow: hidden`) to manage panel sizing.
    - Implemented independent vertical scrolling for the left and right panels.
    - Applied `direction: rtl` to the left panel's scroll container and `direction: ltr` to its direct child (`QuestionContent`) to achieve a left-aligned scrollbar.
    - Added global CSS to prevent `html`, `body` scrolling (`overflow: hidden`, `height: 100%`).
    - Adjusted padding on the right panel's scrollable content area to match the left panel (`p-6`).

3.  **Dependency Cleanup (Previous)**
    - Removed unused dependencies.

## Active Decisions

1.  **LaTeX Editing Flow**

    - Kept `!!` trigger via `LatexTriggerPlugin`.
    - Added `Ctrl+Q` trigger via `MathShortcutPlugin`.
    - Both triggers call `triggerMathfield` in `useMathLiveManager`.
    - `useMathLiveManager` now enforces **single active MathLive instance**, handling focus/scroll redirection.
    - Editor instance is **disabled** (`readOnly`) when its MathLive input is active.

2.  **Lexical Implementation**

    - `registerCommand(KEY_DOWN_COMMAND, ...)` used in `MathShortcutPlugin`.
    - Context (`LatexPluginContext`) passes `triggerMathfield` and `activeMathLiveKey`.

3.  **Layout & Styling**
    - **CSS Grid** used for the main two-column layout to provide explicit sizing and height boundaries.
    - **Independent Scrolling** achieved using `overflow: hidden` on wrappers and `overflow-y: auto` on `h-full` or absolutely positioned inner divs.
    - **Left Scrollbar:** `direction: rtl / ltr` technique applied.
    - Global styles prevent page-level scrollbars.

## Current Issues

1.  **Under Investigation / To Verify**

    - **ResizableBox Handle:** The resizing handle's appearance/functionality might be affected by the parent `overflow: hidden` in the grid layout. Needs testing.
    - Click-to-edit functionality for existing `LatexNode`s.
    - Robustness of cursor positioning after inserting/editing LaTeX.
    - Visual styling/feedback for the `LatexNode`.

2.  **Known Issues (Carry-over)**
    - Timer state persistence.

## Next Steps

1.  **Immediate Tasks**

    - **Test thoroughly:** Verify `Ctrl+Q`, single MathLive focus/scroll, editor disabling, and layout scrolling across different content heights and scenarios.
    - **Test ResizableBox:** Check if the resizing handle works correctly with the grid layout and `overflow: hidden`. Address if necessary.
    - Implement/verify click-to-edit for existing `LatexNode`s.
    - Add visual styling to `LatexNode`.

2.  **Upcoming Features**
    - Refine error handling for MathLive loading and interaction.

## Recent Feedback

- User reported scrolling issues which led to the CSS Grid refactor.
- User requested focus behavior for existing MathLive instance.

## Implementation Notes

- Layout: `app/lambai/(UI)/lambai.tsx` uses CSS Grid.
- Global styles: `ui/Style/index.css`.
- MathLive State/Logic: `app/lambai/(UI)/editor/hooks/useMathLiveManager.ts`.
- Shortcut Plugin: `app/lambai/(UI)/editor/plugins/MathShortcutPlugin.tsx`.
- Editor Component: `app/lambai/(UI)/editor/components/QuestionEditorInstance.tsx`.
