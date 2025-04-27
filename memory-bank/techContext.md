# Technical Context: Assignment Submission Handler

## Technologies Used

### Core Technologies

- Next.js 15.2.3
- React 19
- TypeScript 5
- Neon Database (serverless)
- NextAuth 4.24.11

### Key Dependencies

```json
{
	"@fortawesome/fontawesome-svg-core": "^6.7.2",
	"@fortawesome/free-brands-svg-icons": "^6.7.2",
	"@fortawesome/free-regular-svg-icons": "^6.7.2",
	"@fortawesome/free-solid-svg-icons": "^6.7.2",
	"@fortawesome/react-fontawesome": "^0.2.2",
	"@google/genai": "^0.8.0",
	"@lexical/react": "^0.30.0",
	"@neondatabase/serverless": "^0.10.4",
	"@react-spring/web": "^9.7.5",
	"@tailwindcss/cli": "^4.0.15",
	"bcrypt": "^5.1.1",
	"buffer": "^6.0.3",
	"clsx": "^2.1.1",
	"concurrently": "^9.1.2",
	"equation-editor-react": "^0.0.10",
	"katex": "^0.16.22",
	"lexical": "^0.30.0",
	"mathlive": "^0.105.2",
	"next": "15.2.3",
	"next-auth": "^4.24.11",
	"react": "^19.0.0",
	"react-dom": "^19.0.0",
	"react-katex": "^3.0.1",
	"react-markdown": "^10.1.0",
	"react-resizable": "^3.0.5",
	"rehype-katex": "^7.0.1",
	"rehype-raw": "^7.0.0",
	"remark-math": "^6.0.0",
	"server-only": "^0.0.1",
	"sha3": "^2.1.4"
}
```

## Development Setup

### Project Structure

```
app/
  test/
    page.tsx              # Main page component
    (handler)/
      handler.ts          # Server-side handler
    (UI)/
      lambai.tsx          # UI components
    selection/            # Selection components
  lambai/
    (UI)/
      lambai.tsx              # Main page layout (Grid), Question rendering, Timer
      AnswerArea.tsx          # Orchestrates QuestionEditorInstances, holds useMathLiveManager
      editor/
        components/
          QuestionEditorInstance.tsx # Renders Q text, LexicalComposer, plugins, MathLive input
          LatexComponent.tsx         # Renders LatexNode using react-katex
        hooks/
          useMathLiveManager.ts    # State & logic for MathLive interaction, single instance
        nodes/
          LatexNode.tsx            # Custom Lexical node for LaTeX
        plugins/
          LatexPlugin.tsx          # Context definition (LatexPluginContext)
          LatexTriggerPlugin.tsx   # Handles '!!' trigger
          MathShortcutPlugin.tsx # Handles Ctrl+Q trigger
ui/
  Style/
    index.css                # Global styles (tailwind import, html/body scroll fix)
```

### Component Architecture

1. **Server Components**

   - Handler for task fetching
   - Session management
   - Database operations
   - Time tracking data

2. **Client Components**

   - Split-pane layout
   - Content rendering
   - Timer controls
   - Modern header
   - MathQuill integration

3. **Database Integration**
   ```typescript
   const query = `SELECT "task","work" FROM "User Infomation"."${sanitizedTableName}" WHERE "assignment_id" = $1`;
   const data = await sql(query, [assignmentId]);
   ```

## Technical Constraints

### Server-Side

- Serverless database operations
- Session management
- Cookie handling
- Error handling
- Time tracking data

### Client-Side

- CSS Grid for main layout.
- Independent scrolling panels (`overflow`, `direction`).
- Lexical editor integration.
- Custom Lexical nodes.
- External web component control (MathLive).
- State management (component state, context, custom hooks).
- Keyboard command handling.
- Responsive design basics.
- Timer functionality.

### Database

- Query optimization
- Connection management
- Error handling
- Data validation
- Time data storage

## Development Guidelines

### Server-Side Development

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
   - Use prepared statements
   - Handle errors properly
   - Validate input data
   - Manage connections
   - Store time tracking data

### Client-Side Development

1. **UI Components**

   - Split-pane layout
   - Resizable panels
   - Content rendering
   - Responsive design
   - Timer controls
   - Modern header

2. **State Management**

   - Panel width state
   - Content state
   - UI state
   - Timer state
   - Responsive adjustments

3. **Timer Implementation**
   - Use useState for timer state
   - Use useRef for interval management
   - Implement start/pause/stop functionality
   - Format time display
   - Handle cleanup properly

## Testing Considerations

- Server-side handler testing
- Database operation testing
- UI component testing
- Timer functionality testing
- Integration testing
- Performance testing
- Layout/Scrolling robustness (Grid, overflow, direction).
- ResizableBox handle interaction.
- Lexical/MathLive interaction (`!!`, `Ctrl+Q`, click-to-edit, focus, disable).
- Cross-browser testing for layout and editor features.
- Timer functionality testing.
- Integration testing.
