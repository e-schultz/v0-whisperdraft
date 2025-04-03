# Whisperdraft Architecture Documentation

## Overview

Whisperdraft is a minimalist writing environment where users write freely and receive gentle AI feedback based on their evolving edits. It follows a "build shacks, not cathedrals" philosophy, prioritizing simplicity, modularity, and user focus over complex features.

### Core Principles

- **Local-first**: All data is stored in the browser's localStorage
- **Distraction-free**: Clean, minimal UI focused on the writing experience
- **Diff-aware**: Tracks changes between versions to provide context to the AI
- **Thoughtful**: Tuned for reflective writing flow, not rapid iteration

## Application Architecture

### Layout Structure

Whisperdraft uses a two-pane layout:

- **Left Panel**: Note editor (TipTap rich text editor)
- **Right Panel**: AI response panel showing the AI's reflections on user's writing

On mobile devices, the panels are swipeable instead of side-by-side.

### Data Flow

