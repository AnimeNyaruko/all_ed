# Active Context: Assignment Submission Handler

## Current Focus

The current development focus is on refining the LaTeX editing experience within the Lexical editor, specifically integrating MathLive for equation input and editing.

## Recent Changes

1.  **LaTeX/MathLive Integration (`AnswerArea.tsx`)**

    - Implemented a `LatexTriggerPlugin` to detect `!!` typed by the user.
    - Typing `!!` now removes the characters and triggers the external MathLive (`<math-field>`) input for creating a new LaTeX node.
    - Pressing Enter in the MathLive input inserts a new `LatexNode` into the Lexical editor at the trigger location.
    - Refactored type handling within the plugin (`$isRangeSelection`, `$setSelection`) to resolve TypeScript errors.
    - The MathLive input appears conditionally below the corresponding Lexical editor instance.

2.  **Previous Timer & UI Updates**
    - Timer controls (start/pause/stop) functional.
    - Modern header design implemented.
    - MathQuill integration (prior approach, now shifting towards MathLive via Lexical nodes).

## Active Decisions

1.  **LaTeX Editing Flow**

    - Using custom Lexical `LatexNode` to represent equations.
    - Using external MathLive component (`<math-field>`) for actual LaTeX input/editing, triggered by interactions (click on existing node or `!!` trigger).
    - `LatexTriggerPlugin` handles the `!!` detection and initiation.
    - `AnswerArea.tsx` manages the state for MathLive visibility and communication between Lexical and MathLive.

2.  **Lexical Implementation**

    - Using `registerUpdateListener` to monitor text changes for the `!!` trigger.
    - Using `$isRangeSelection`, `$setSelection`, and `removeText()` within `editor.update()` for safe state modification.
    - Using `LexicalPluginContext` to pass the `triggerMathfield` function down.

3.  **UI Design**
    - Conditionally rendering the MathLive input below the relevant editor.
    - Maintaining split-pane layout.

## Current Issues

1.  **Under Investigation**

    - Click-to-edit functionality for existing `LatexNode`s (needs verification/implementation within `LatexComponent` and `LatexPluginContext`).
    - Robustness of cursor positioning after inserting/editing LaTeX.
    - Visual styling/feedback for the `LatexNode` and the active MathLive input.

2.  **Known Issues (Carry-over)**
    - Timer state persistence.
    - General UI responsiveness optimizations.

## Next Steps

1.  **Immediate Tasks**

    - Implement/verify click-to-edit for existing `LatexNode`s using the `triggerMathfield` mechanism.
    - Add visual styling to `LatexNode` (e.g., background, border) and the MathLive input container.
    - Test cursor positioning thoroughly after LaTeX interactions.

2.  **Upcoming Features**
    - Refine error handling for MathLive loading and interaction.
    - Consider alternatives or improvements to the external MathLive input UX.

## Recent Feedback

- N/A (Focus has been on implementation).

## Implementation Notes

- Lexical editor setup is within `app/lambai/(UI)/AnswerArea.tsx`.
- Custom node: `app/lambai/(UI)/editor/nodes/LatexNode.tsx`.
- Node component: `app/lambai/(UI)/editor/components/LatexComponent.tsx`.
- Trigger logic: `LatexTriggerPlugin` within `AnswerArea.tsx`.
