# Assignment Submission Handler Project Brief

## Project Overview

A Next.js-based web application that handles assignment submissions with a focus on task management and user interaction. The system includes a CSS Grid-based two-column layout for viewing assignments and submitting work, with support for mathematical content rendering (via Lexical and MathLive) and time tracking.

## Core Requirements

1. Assignment Management

   - Task fetching from database
   - Assignment ID cookie handling
   - User session management
   - Task display and submission
   - Time tracking and management

2. User Interface

   - Stable CSS Grid layout (question/answer)
   - Resizable left panel (handle needs verification)
   - Independent panel scrolling
   - Math content rendering
   - Responsive design basics
   - Timer controls (start, pause, stop)
   - Modern header with logo and controls

3. Content Handling
   - Markdown support
   - LaTeX math rendering
   - Lexical editor for text input
   - MathLive integration for equation editing (`!!` and `Ctrl+Q` triggers)
   - Single active MathLive instance enforcement
   - Editor disabling during math input

## Goals

- Create an efficient assignment submission system
- Provide a clear interface for task viewing and submission
- Support mathematical content rendering
- Ensure secure user authentication
- Maintain proper session handling
- Implement effective time tracking
- Deliver a modern, responsive, and robust UI with independent scrolling panels

## Success Criteria

- Users can view and submit assignments
- Mathematical content renders correctly
- Session management works reliably
- Assignment tracking is accurate
- Interface is intuitive, responsive, and panels scroll independently without page scroll
- Math input via `!!` and `Ctrl+Q` works reliably, enforcing single instance with focus
- Editor disables correctly during math input
