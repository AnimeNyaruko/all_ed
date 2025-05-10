# System Patterns: Assignment Submission Handler

## Architecture Overview

The Assignment Submission Handler is built as a Next.js application using the App Router. It features a two-column layout managed by CSS Grid for viewing assignments and submitting work via a client-side Lexical editor (`AnswerArea.tsx`, `QuestionEditorInstance.tsx`) enhanced with MathLive for LaTeX input. The system is organized with clear separation of concerns: UI, handler, data_handler, API, and utilities.

## Key Components

### Server Components

1. **Handler System**

   - Task fetching from database
   - Session management (NextAuth, Google, Email)
   - Cookie handling
   - Error handling
   - Middleware for route protection

2. **Database Integration**
   - Serverless database connection (Neon)
   - Query execution
   - Result processing
   - Error handling
   - Versioning and audit trail

### Client Components

1. **UI Layout (`lambai.tsx`, `ui/Style/index.css`)**

   - **CSS Grid Layout:** Main content area uses `display: grid` with columns defined by `gridTemplateColumns: \\`${leftWidth}px 1fr\\``. The main container (`h-screen flex flex-col`) and the grid container (`flex-grow`) manage height dynamically, allowing the content area to fill available space below the header. Container has `overflow: hidden`.
   - **Independent Scrolling:** Left and right panels achieve independent scrolling.
   - **Left Scrollbar Position:** CSS `direction: rtl / ltr` trick.
   - **Resizable Panels:** Custom Ghost Drag implementation.
   - **Global Styles:** `html, body` have `height: 100%`, `overflow: hidden`.
   - Modern header & Timer controls.
   - **Responsive Design:** Layout adapts for desktop, tablet, and mobile (cross-platform, needs further testing).

2. **Content Management & Editing (`AnswerArea.tsx`, `editor/`)**

   - Lexical editor instance per question (`QuestionEditorInstance`).
   - `RichTextPlugin` for basic text editing.
   - Custom `LatexNode` to represent inline LaTeX.
   - `LatexComponent` renders `LatexNode` using `react-katex` (for display within editor).
   - External MathLive (`<math-field>`) web component for LaTeX input/editing.
   - **Triggers:**
     - `LatexTriggerPlugin` detects `!!`.
     - `MathShortcutPlugin` detects `Ctrl+Q` using `registerCommand(KEY_DOWN_COMMAND, ...)`. Both call `triggerMathfield`.
   - **Single MathLive Instance (`useMathLiveManager.ts`):**
     - Hook manages `activeMathLiveKey` state.
     - `triggerMathfield` checks `activeMathLiveKey`; if another instance is active, it scrolls to and focuses the existing `<math-field>` element instead of opening a new one.
   - **Editor Disabling (`QuestionEditorInstance.tsx`):**
     - `ContentEditable` component receives `readOnly={isLatexInputVisible[questionKey]}` prop.
   - **Context (`LatexPluginContext`)**: Provides `triggerMathfield` and `activeMathLiveKey`.
   - `lexicalStateToAnswerBlocks` converts editor state to structured data.

3. **Timer System (within `lambai.tsx`)**

   - Start/Pause/Stop controls
   - Time display
   - State management (`useState`, `useRef`)

4. **Authentication & Middleware**

   - NextAuth for Google/Email login
   - Middleware for route protection
   - API endpoints for login, register, session

5. **API & AI Integration**
   - RESTful API routes for assignment submission (`/api/nopbai`), assignment creation (`/api/taobai`), authentication (`/api/auth`, `/api/login`, `/api/register`), and AI bot integration (`/api/taobai/[id]/bot`).
   - Dynamic API route pattern (`/api/taobai/[id]/bot`, `/api/taobai/[id]/handler`)
   - Error handling and validation
   - Prompt engineering for LaTeX and answer formatting

## Design Patterns

### Server-Side Patterns

- Handler implementation with try/catch and error handling
- Database operations with prepared statements and validation
- Middleware for authentication and route protection
- Versioning and audit trail for submissions

### Client-Side Patterns

- Layout: CSS Grid, overflow management, responsive design
- Lexical editor configuration with plugin-based extensibility
- Custom Lexical nodes for LaTeX
- Context for cross-component communication
- Custom hooks for encapsulating logic (`useMathLiveManager`, `usePanelResizer`)
- API interaction via RESTful endpoints
- AI integration via dynamic API route
- Memoization (`React.memo`, `useMemo`, `useCallback`) for performance
- Error boundary and fallback UI for robustness

### API Patterns

- RESTful API with dynamic route segments
- Centralized error handling and validation
- Separation of handler/data_handler logic
- Prompt engineering for AI endpoints

### Testing & Maintenance Patterns

- Linting and formatting after each significant change
- Dependency review and update
- Proactive performance optimization (memoization)
- Responsive and cross-device testing
- Versioning and audit trail

## Component Relationships

```mermaid
graph TD
    App[lambai.tsx Page]
    GlobalCSS[ui/Style/index.css]

    subgraph App
        LayoutGrid{Grid Container (h-calc, overflow-hidden, relative)}
        LeftPanelWrapper{Left Panel Wrapper (overflow-hidden)}
        RightPanelWrapper{Right Panel Wrapper (overflow-hidden)}
        Header[Header]
        DragHandle[Custom Drag Handle (div)]
        GhostBar[Ghost Bar (div, conditional)]
        QuestionContent[QuestionContent (direction: ltr)]
        AnswerArea[AnswerArea]

        LayoutGrid -- contains --> LeftPanelWrapper
        LayoutGrid -- contains --> RightPanelWrapper
        LayoutGrid -- contains --> DragHandle
        LayoutGrid -- contains --> GhostBar
        App --> Header

        LeftPanelWrapper --> LeftScrollDiv(Scroll Div (h-full, overflow-y:auto, direction:rtl))
        LeftScrollDiv --> QuestionContent

        RightPanelWrapper --> RightScrollDiv(Scroll Div (absolute, inset-0, p-6, overflow-y:auto))
        RightScrollDiv --> AnswerArea

        DragHandle -- interaction triggers --> GhostBar[updates position]
        DragHandle -- interaction end updates --> LayoutGrid[gridTemplateColumns]
    end

    subgraph AnswerArea
        Hook[useMathLiveManager]
        EditorInstanceMap(QuestionEditorInstance * N)

        Hook --> EditorInstanceMap
    end

    subgraph EditorInstance [QuestionEditorInstance]
        LexicalComposer[LexicalComposer]
        LatexContextProv[LatexPluginContext.Provider]
        RichTextPlugin[RichTextPlugin]
        ContentEditable[ContentEditable (readOnly logic)]
        HistoryPlugin[HistoryPlugin]
        OnChangePlugin[OnChangePlugin]
        LatexTriggerPlugin[LatexTriggerPlugin]
        MathShortcutPlugin[MathShortcutPlugin]
        MathLiveInput{math-field (conditionally rendered, directly below editor)}
        LatexNode[LatexNode] --> LatexComponent[LatexComponent]

        LexicalComposer --> LatexContextProv
        LexicalComposer -- registers --> LatexNode
        LatexContextProv --> RichTextPlugin
        LatexContextProv --> HistoryPlugin
        LatexContextProv --> OnChangePlugin
        LatexContextProv --> LatexTriggerPlugin
        LatexContextProv --> MathShortcutPlugin
        RichTextPlugin --> ContentEditable
        LexicalComposer -- followed by --> MathLiveInput
    end

    Hook -- provides --> triggerMathfield
    Hook -- provides --> handleMathfieldKeyDown
    Hook -- provides --> activeMathLiveKey
    Hook -- provides --> isLatexInputVisible

    LatexTriggerPlugin -- calls --> triggerMathfield
    MathShortcutPlugin -- calls --> triggerMathfield
    LatexComponent -- onClick calls --> triggerMathfield

    triggerMathfield -- reads --> activeMathLiveKey
    triggerMathfield -- calls --> scrollIntoView & focus
    triggerMathfield -- updates --> Hook State (visibility, value, activeKey)

    handleMathfieldKeyDown -- calls --> editor.update()
    handleMathfieldKeyDown -- updates --> Hook State (visibility, value, activeKey=null)

    EditorInstance -- reads --> isLatexInputVisible -- sets --> ContentEditable[readOnly]

    GlobalCSS -- styles --> html, body
```
