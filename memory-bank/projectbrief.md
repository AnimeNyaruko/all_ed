# LaTeX Math Editor Project Brief (within Assignment Handler)

## Project Overview

A Next.js-based assignment submission application featuring an advanced LaTeX math editor. The core is a CSS Grid-based two-column layout for viewing assignments and submitting work, utilizing Lexical as the rich-text foundation and integrating MathLive for a dedicated LaTeX input/editing experience.

## Core Requirements

1. Assignment Management

   - Task fetching from database
   - Assignment ID cookie handling
   - User session management
   - Task display and submission
   - Time tracking and management

2. User Interface & Layout

   - Stable CSS Grid layout (question/answer) with independent scrolling.
   - Left panel scrollbar positioned on the left (`direction: rtl/ltr`).
   - Resizable left panel (`ResizableBox` - needs verification).
   - Modern header with logo and controls.
   - Timer controls (start, pause, stop).

3. **Advanced Math Editor (Lexical + MathLive)**
   - Rich-text editing via Lexical (`AnswerArea.tsx`, `QuestionEditorInstance.tsx`).
   - Inline LaTeX rendering using `react-katex` (via custom `LatexNode`).
   - Dedicated LaTeX input/editing via external MathLive component (`<math-field>`).
   - **Triggering MathLive:**
     - Text input: `!!` (`LatexTriggerPlugin`).
     - Keyboard shortcut: `Ctrl+Q` (`MathShortcutPlugin`).
     - Click on existing equation (Needs implementation/verification).
   - **Single Active Instance:** Only one MathLive input can be active; attempts to open another will focus the existing one (`useMathLiveManager`).
   - **Editor Disabling:** The underlying Lexical editor instance is disabled (`readOnly`) when its associated MathLive input is active.

## Goals

- Create an efficient assignment submission system.
- Provide a clear UI for task viewing and submission with robust scrolling.
- **Deliver a powerful and intuitive LaTeX math editing experience.**
- Ensure secure user authentication and session handling.
- Implement effective time tracking.

## Success Criteria

- Users can view and submit assignments.
- **LaTeX equations can be easily created (`!!`, `Ctrl+Q`) and edited (click - TBD).**
- **MathLive interaction enforces a single active instance with focus redirection.**
- **Lexical editor correctly disables during MathLive input.**
- Mathematical content renders correctly within the editor (`react-katex`) and potentially in the question display.
- Session management works reliably.
- Interface is intuitive, responsive, and panels scroll independently without page scroll.
- Left panel is resizable (handle verified).
