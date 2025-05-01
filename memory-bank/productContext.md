# Product Context: Assignment Handler with Advanced Math Editor

## Purpose

The platform provides a streamlined interface for students to view and submit assignments. A key feature is its integrated **advanced LaTeX math editor**, built with Lexical and MathLive, designed to offer an intuitive and powerful way to handle mathematical content alongside regular text, complemented by time tracking and a robust user experience.

## Problems Solved

1. **Assignment Management**

   - Centralized task viewing and submission.
   - Secure assignment tracking & session handling.
   - Time tracking and management.

2. **User Experience & Layout**

   - Stable CSS Grid split-pane interface for clear reference and independent scrolling.
   - Left-aligned scrollbar on the left panel for consistency.
   - Resizable left panel for layout flexibility (handle needs verification).
   - Modern, intuitive header and timer controls.

3. **Advanced Content Handling (Focus: Math)**
   - Mixed text and math content management via Lexical.
   - **Intuitive LaTeX Input:** Multiple triggers (`!!`, `Ctrl+Q`) for initiating the dedicated MathLive input.
   - **Seamless Editing:** Display of equations using `react-katex` (`LatexNode`), editing via MathLive.
   - **Conflict Prevention:** Ensures only one MathLive instance is active at a time, focusing the existing one if needed.
   - **Focused Editing:** Disables the main text editor (`readOnly`) while the MathLive input is active, preventing accidental text changes.
   - Markdown support for general text formatting.

## User Experience Goals

1. **Assignment Viewing & Navigation**

   - Clear task display with correctly rendered math.
   - Easy navigation within panels with independent scrolling.
   - Responsive layout.
   - Visible time tracking.

2. **Submission & Content Creation**

   - Simple submission process.
   - **Effortless Math Entry:** Quick triggering of MathLive via `!!` or `Ctrl+Q`.
   - **Intuitive Math Editing:** Clicking an existing equation should seamlessly open it in MathLive (Needs implementation/verification).
   - **Clear State Feedback:** Visual cues indicating when MathLive is active and the main editor is disabled.
   - **Non-disruptive Workflow:** Prevent confusion by managing a single active MathLive instance and focusing it when necessary.
   - Session persistence & error handling.

3. **Visual Design**
   - Clean, modern interface.
   - Stable CSS Grid split-pane layout with independent scrolling and left-aligned scrollbar.
   - Resizable panels (handle needs verification).

## User Workflow (Focus on Math Editing)

1. **Assignment Access:** (Standard: Authenticate, fetch task, display, timer available).
2. **Task Viewing:** Question with rendered math in the left (scrollable, resizable) pane.
3. **Answering / Content Creation:**
   - Enter text in the right (scrollable) pane using Lexical.
   - To insert a **new** equation: Type `!!` or press `Ctrl+Q`.
     - If no other MathLive input is active: The MathLive input appears, and the Lexical editor instance becomes `readOnly`.
     - If another MathLive input _is_ active: The application scrolls to and focuses the existing MathLive input.
   - To edit an **existing** equation: Click on the rendered equation (Needs implementation/verification).
     - Similar logic: opens MathLive, makes editor `readOnly`, handles single instance focus.
   - Enter/edit LaTeX in the focused MathLive input.
   - Press `Enter` in MathLive: The input closes, the LaTeX is saved to the Lexical state (inserted or updated `LatexNode`), and the Lexical editor instance becomes editable again.
   - Continue adding text or other equations.
4. **Time Management & Submission:** (Standard: Use timer, submit work).
