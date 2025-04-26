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
	"next": "15.2.3",
	"react": "^19.0.0",
	"react-dom": "^19.0.0",
	"@neondatabase/serverless": "^0.10.4",
	"next-auth": "^4.24.11",
	"react-markdown": "^10.1.0",
	"remark-math": "^6.0.0",
	"rehype-katex": "^7.0.1",
	"katex": "^0.16.22"
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
```

### Component Architecture

1. **Server Components**

   - Handler for task fetching
   - Session management
   - Database operations

2. **Client Components**

   - Split-pane layout
   - Content rendering
   - Math toolbar
   - Responsive design

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

### Client-Side

- Split-pane layout
- Content rendering
- Responsive design
- State management

### Database

- Query optimization
- Connection management
- Error handling
- Data validation

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

### Client-Side Development

1. **UI Components**

   - Split-pane layout
   - Resizable panels
   - Content rendering
   - Responsive design

2. **State Management**
   - Panel width state
   - Content state
   - UI state
   - Responsive adjustments

## Testing Considerations

- Server-side handler testing
- Database operation testing
- UI component testing
- Integration testing
- Performance testing
