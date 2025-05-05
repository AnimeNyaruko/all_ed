# System Patterns: Assignment Submission Handler

## Architecture Overview

The Assignment Submission Handler is built as a Next.js application using the App Router. It features a two-column layout managed by CSS Grid for viewing assignments and submitting work via a client-side Lexical editor (`AnswerArea.tsx`, `QuestionEditorInstance.tsx`) enhanced with MathLive for LaTeX input.

## Key Components

### Server Components

1. **Handler System**

   - Task fetching from database
   - Session management
   - Cookie handling
   - Error handling

2. **Database Integration**
   - Serverless database connection (Neon)
   - Query execution
   - Result processing
   - Error handling

### Client Components

1. **UI Layout (`lambai.tsx`, `ui/Style/index.css`)**

   - **CSS Grid Layout:** Main content area uses `display: grid` with columns defined by `gridTemplateColumns: \`${leftWidth}px 1fr\``. Container has fixed height (`calc(100vh - headerHeight)`) and `overflow: hidden`.\n    - **Independent Scrolling:** Left and right panels achieve independent scrolling.\n        - Wrapper divs (`relative/overflow-hidden`or`bg-white p-6 overflow-hidden relative`) clip overflow within their grid cell.\n        - Inner content divs use `h-full overflow-y-auto`or`absolute inset-0 overflow-y-auto`.\n    - **Left Scrollbar:** Left panel uses `direction: rtl`on the scroll container and`direction: ltr` on the content (`QuestionContent`) to position scrollbar on the left.\n    - **Resizable Panels:** Custom Ghost Drag implementation.\n    - **Global Styles:**`html, body`have`height: 100%`, `overflow: hidden`.\n - Modern header & Timer controls.\n

2. **Content Management & Editing (`AnswerArea.tsx`, `editor/`)**

   - Lexical editor instance per question (`QuestionEditorInstance`).\n - `RichTextPlugin` for basic text editing.\n - Custom `LatexNode` to represent inline LaTeX.\n - `LatexComponent` renders `LatexNode` using `react-katex` (for display within editor).\n - External MathLive (`<math-field>`) web component for LaTeX input/editing.\n - **Triggers:**\n - `LatexTriggerPlugin` detects `!!`.\n - `MathShortcutPlugin` detects `Ctrl+Q` using `registerCommand(KEY_DOWN_COMMAND, ...)`. Both call `triggerMathfield`.\n - **Single MathLive Instance (`useMathLiveManager.ts`):**\n - Hook manages `activeMathLiveKey` state.\n - `triggerMathfield` checks `activeMathLiveKey`; if another instance is active, it scrolls to and focuses the existing `<math-field>` element instead of opening a new one.\n - **Editor Disabling (`QuestionEditorInstance.tsx`):**\n - `ContentEditable` component receives `readOnly={isLatexInputVisible[questionKey]}` prop.\n - **Context (`LatexPluginContext`)**: Provides `triggerMathfield` and `activeMathLiveKey`.\n - `lexicalStateToAnswerBlocks` converts editor state to structured data.\n

3. **Timer System (within `lambai.tsx`)**
   - Start/Pause/Stop controls
   - Time display
   - State management (`useState`, `useRef`)

## Design Patterns

### Server-Side Patterns

1. **Handler Implementation**

   ```typescript
   export async function handler() {
   	try {
   		const assignmentId = await getCookie("assignment_id");
   		const username = await getCookie("session");
   		// Handle authentication and task fetching
   	} catch (error) {
   		// Error handling
   	}
   }
   ```

2. **Database Operations**
   ```typescript
   async function fetchTask(assignmentId: string, sanitizedTableName: string) {
   	const query = `SELECT "task","work" FROM "User Infomation"."${sanitizedTableName}" WHERE "assignment_id" = $1`;
   	const data = await sql(query, [assignmentId]);
   	return data;
   }
   ```

### Client-Side Patterns

1. **Layout: CSS Grid & Overflow Management**

   - Explicit grid definition (`gridTemplateColumns`) combined with fixed-height container (`h-[calc(100vh-64px)]`).\n - `overflow: hidden` on grid cells (panel wrappers) prevents content from forcing parent scroll.\n - `overflow-y: auto` on inner elements (with defined height like `h-full` or `inset-0`) enables content scrolling.\n - **Left Scrollbar Position:** CSS `direction: rtl / ltr` trick.\n

2. **Lexical Editor Configuration (`QuestionEditorInstance.tsx`, `AnswerArea.tsx`, `InitialContentPlugin.tsx`)**

   - Plugins (`RichTextPlugin`, `HistoryPlugin`, `OnChangePlugin`, `LatexTriggerPlugin`, `MathShortcutPlugin`, `InitialContentPlugin`) provide functionality.
   - Context (`LatexPluginContext`) used for cross-component communication (`triggerMathfield`, `activeMathLiveKey`).
   - `lexicalStateToAnswerBlocks` (in `AnswerArea`) converts `EditorState` to `AnswerBlock[]`, inserting `{ type: 'text', content: '\n' }` between paragraphs.
   - `InitialContentPlugin` parses `AnswerBlock[]` (including `\n` blocks) to reconstruct the editor state with correct paragraph breaks upon loading saved work.

3. **External UI Interaction (MathLive)**

   - Interactions (`!!`, `Ctrl+Q`, click) call `triggerMathfield` (via context).
   - `triggerMathfield` manages single active instance (focus/scroll) and state updates.
   - Submitting MathLive (`handleMathfieldKeyDown`) uses `editor.update()`.
   - Editor disabling (`readOnly`) managed in `QuestionEditorInstance`.
   - `<math-field>` rendered directly within `QuestionEditorInstance`, not via Portal.

4. **State Management (`useMathLiveManager`, `lambai.tsx`)**

   - Custom hook `useMathLiveManager` encapsulates MathLive interaction state and logic (visibility, current value, editing key, active instance key, trigger logic, keydown handler).\n - Component state in `lambai.tsx` for panel width, answers, timer, etc.\n

5. **Custom Lexical Nodes (`LatexNode.tsx`)**

   - Extends `DecoratorNode`.
   - `decorate` method renders the React component (`LatexComponent`) for display.
   - `importJSON`, `exportJSON` for serialization.
   - `createDOM`, `updateDOM` for basic DOM structure.
   - Custom methods like `setLatex`.

6. **Keyboard Shortcuts (`MathShortcutPlugin.tsx`)**

   - Uses `editor.registerCommand(KEY_DOWN_COMMAND, ...)`.\n - Checks for specific key combination (`Ctrl+Q`).\n - Prevents default browser action (`event.preventDefault()`).\n - Calls context function (`triggerMathfield`) to initiate action.\n - Handles selection removal within `editor.update()` before calling trigger.\n

7. **Custom Resizing: Ghost Drag (`lambai.tsx`, `hooks/usePanelResizer.ts`)**

   - **Hook (`usePanelResizer.ts`):** Encapsulates the state (`leftWidth`, `isDragging`, `ghostLeft`), refs (`dragStartXRef`, `startLeftWidthRef`, `ghostLeftRef`), event handlers (`handleDragMove`, `handleDragEnd`, `handleDragStart`), and the `useEffect` for managing global listeners.
   - **Component (`lambai.tsx`):** Imports and calls `usePanelResizer`, passing the initial width. Uses the returned values (`leftWidth`, `isDragging`, `ghostLeft`, `handleDragStart`) to render the layout, handle, and ghost bar.
   - **(Original Logic Details - Now in Hook):**
     - Replaces `ResizableBox`.
     - **State:** Uses `isDragging` (boolean), `ghostLeft` (number | null for ghost position).
     - **Refs:** Uses `dragStartXRef` (number | null), `startLeftWidthRef` (number), `ghostLeftRef` (number | null for latest position) to manage drag state and avoid stale closure issues.
     - **Event Handling:**
       - `onMouseDown`/`onTouchStart` on the handle `div` triggers `handleDragStart`.
       - `handleDragStart`: Sets `isDragging=true`, records start X and width, initializes ghost state/ref.
       - `useEffect [isDragging]`: Adds/removes global `mousemove`/`touchmove` and `mouseup`/`touchend` listeners to `document`.
       - `handleDragMove`: Calculates new ghost position based on delta X, applies constraints, updates `ghostLeft` state (for render) and `ghostLeftRef` (for `handleDragEnd`). Prevents default text selection.
       - `handleDragEnd`: Sets `isDragging=false` (triggers listener removal via `useEffect`), reads final position from `ghostLeftRef`, updates `leftWidth` state to apply layout change, resets refs and ghost state.
     - **Rendering:**
       - Handle `div` is positioned absolutely based on `leftWidth`.
       - Ghost `div` is rendered conditionally based on `isDragging` and positioned absolutely based on `ghostLeft`.
     - **Layout Update:** Main layout `div` uses `style={{ gridTemplateColumns: \`${leftWidth}px 1fr\` }}`.

8. **Client-Side Parsing and Rendering for Mixed Content (`@ketqua`)**

   - Khi dữ liệu từ backend là chuỗi text thuần túy chứa cả văn bản và LaTeX (ví dụ: được bao bọc bởi `$..$`), sử dụng hàm parser (`utils/latexParser.ts`) để tách chuỗi thành các khối text và latex.
   - Sử dụng một component renderer riêng (`app/ketqua/(UI)/MixedContentRenderer.tsx`) để lặp qua các khối đã phân tích.
   - Render khối text bằng thẻ `<span>` (với `whiteSpace: 'pre-wrap'` nếu cần giữ khoảng trắng/xuống dòng trong text).
   - Render khối latex bằng thư viện phù hợp (ví dụ: `<InlineMath>` từ `react-katex`).
   - Áp dụng phương pháp này cho tất cả các trường cần hiển thị nội dung hỗn hợp trên trang kết quả.

9. **API Interaction & Prompt Engineering (`/api/nopbai`, `/api/taobai`)**
   - **`/api/nopbai`:**
     - Handles AI responses containing correctly escaped backslashes (`\\`) for LaTeX and literal newlines (`\n`).
     - Prompt instructs AI to return only the final result, format units correctly, wrap necessary LaTeX in `$ ... $`, avoid custom delimiters, and use literal newlines.
   - **`/api/taobai`:**
     - Handles AI responses containing standard JSON strings (no pre-escaped quotes `\\"`).
     - Prompt instructs AI on structure, content integration, question generation rules (including difficulty sorting, LaTeX-only answers), and specific constraints (Chemistry standard condition 24.79 L/mol).
     - Prompt requires AI to return a single string containing the valid JSON structure.

## Technical Decisions

### Next.js Integration

- App Router structure
- Server components for data fetching
- Client components for interactivity
- API route handling

### Database Integration

- Serverless database
- Prepared statements
- Error handling
- Session management
- Time tracking

### UI Framework / Layout

- React components.
- **Tailwind CSS** for styling.
- **CSS Grid** for main two-column layout (replaced Flexbox).
- CSS `direction: rtl/ltr` for left scrollbar.
- **Custom hook/logic (`usePanelResizer`)** for left panel width adjustment (Ghost Drag).
- FontAwesome icons.

### Editor: Lexical

- Lexical chosen for its extensibility.

### LaTeX Rendering (Display): `react-katex`

- Used within `LatexComponent` for inline display in the editor.

### LaTeX Input/Editing: MathLive

- MathLive (`<math-field>`) used externally for a dedicated, powerful math input experience.

### Interaction Bridge: React Context

- React Context (`LatexPluginContext`) and state management in `AnswerArea.tsx` connect Lexical interactions to the external MathLive component.

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
