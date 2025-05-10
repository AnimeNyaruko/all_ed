# Product Context: Assignment Handler with Advanced Math Editor

## Purpose

The platform provides a streamlined interface for students to view, create, and submit assignments. A key feature is its integrated **advanced LaTeX math editor**, built with Lexical and MathLive, designed to offer an intuitive and powerful way to handle mathematical content alongside regular text, complemented by time tracking, robust user experience, and AI-powered assignment creation.

## Problems Solved

1. **Assignment Management**

   - Centralized task viewing, creation, and submission.
   - Secure assignment tracking & session handling (NextAuth, Google, Email).
   - Time tracking and management.
   - Versioning and audit trail for submissions.

2. **User Experience & Layout**

   - Stable CSS Grid split-pane interface for clear reference and independent scrolling.
   - Left-aligned scrollbar on the left panel for consistency.
   - Resizable left panel for layout flexibility (custom Ghost Drag).
   - Modern, intuitive header and timer controls.
   - Responsive design for desktop, tablet, and mobile (cross-platform, needs further testing).

3. **Advanced Content Handling (Focus: Math)**

   - Mixed text and math content management via Lexical.
   - **Intuitive LaTeX Input:** Multiple triggers (`!!`, `Ctrl+Q`) for initiating the dedicated MathLive input.
   - **Seamless Editing:** Display of equations using `react-katex` (`LatexNode`), editing via MathLive (click-to-edit in progress).
   - **Conflict Prevention:** Ensures only one MathLive instance is active at a time, focusing the existing one if needed.
   - **Focused Editing:** Disables the main text editor (`readOnly`) while the MathLive input is active, preventing accidental text changes.
   - Markdown support for general text formatting.

4. **API & AI Integration**
   - RESTful API for assignment submission, creation, authentication, and AI bot integration.
   - AI bot for assignment creation and answer checking (via `/api/taobai/[id]/bot`).
   - Prompt engineering for LaTeX and answer formatting.

## User Experience Goals

1. **Assignment Workflow**

   - User authenticates (Google, Email, NextAuth).
   - User views available assignments or creates a new one (AI bot supported).
   - User selects an assignment to work on.
   - User answers questions using the advanced math editor (Lexical + MathLive).
   - User submits the assignment.
   - User can view results and feedback (with LaTeX rendering).
   - All actions are tracked for versioning and audit.

2. **Assignment Viewing & Navigation**

   - Clear task display with correctly rendered math.
   - Easy navigation within panels with independent scrolling.
   - Responsive layout for all device sizes.
   - Visible time tracking.

3. **Submission & Content Creation**

   - Simple submission process.
   - **Effortless Math Entry:** Quick triggering of MathLive via `!!` or `Ctrl+Q`.
   - **Intuitive Math Editing:** Clicking an existing equation should seamlessly open it in MathLive (in progress).
   - **Clear State Feedback:** Visual cues indicating when MathLive is active and the main editor is disabled.
   - **Non-disruptive Workflow:** Prevent confusion by managing a single active MathLive instance and focusing it when necessary.
   - Session persistence & error handling.
   - Versioning and audit trail for all submissions.

4. **Visual Design**
   - Clean, modern interface.
   - Stable CSS Grid split-pane layout with independent scrolling and left-aligned scrollbar.
   - Resizable panels (custom Ghost Drag).
   - Responsive for desktop, tablet, and mobile.

## User Workflow (End-to-End)

1. **Authentication:** User logs in via Google, Email, or NextAuth.
2. **Assignment Access:** User views or creates assignments (AI bot supported).
3. **Task Viewing:** Question with rendered math in the left (scrollable, resizable) pane.
4. **Answering / Content Creation:**
   - Enter text in the right (scrollable) pane using Lexical.
   - To insert a **new** equation: Type `!!` or press `Ctrl+Q`.
     - If no other MathLive input is active: The MathLive input appears, and the Lexical editor instance becomes `readOnly`.
     - If another MathLive input _is_ active: The application scrolls to and focuses the existing MathLive input.
   - To edit an **existing** equation: Click on the rendered equation (in progress).
     - Similar logic: opens MathLive, makes editor `readOnly`, handles single instance focus.
   - Enter/edit LaTeX in the focused MathLive input.
   - Press `Enter` in MathLive: The input closes, the LaTeX is saved to the Lexical state (inserted or updated `LatexNode`), and the Lexical editor instance becomes editable again.
   - Continue adding text or other equations.
5. **Time Management & Submission:** Use timer, submit work. All actions are versioned and auditable.
6. **Result Viewing:** User can view results, feedback, and history of submissions.
