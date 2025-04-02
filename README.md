# Whisperdraft

A shack for thought, with a ghost in the walls.

## Overview

Whisperdraft is a minimalist writing environment where your thoughts evolve freely, and an AI companion responds softly from the side. The left panel is yours — a quiet cabin for ideas. On the right, a presence listens. Every few lines, it stirs, offering suggestions or reflections drawn from your recent edits. It's not here to lead. Just to witness, reflect, and gently echo back.

## Philosophy

Born from a "build shacks, not cathedrals" philosophy, Whisperdraft is designed to be small, local-first, and modular. It stores diffs, tracks note evolution, and talks to an LLM — but only when asked. Ideal for writers, thinkers, and neurodivergent dreamers who want a space that honors process over polish.

## Features

- **Two-Pane Layout**: A live note editor on the left and an AI response panel on the right
- **Diff Tracking**: Automatically captures differences between the current note content and the last saved snapshot
- **Local-First**: All data is stored in your browser's local storage
- **Responsive Design**: Works on both desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Auto-Save**: Automatically saves your notes every 30 seconds
- **Export**: Export your notes and chat history

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Start writing in the note panel
2. Your changes will be saved automatically every 30 seconds
3. The AI companion will respond to your changes in the right panel
4. You can also manually save by clicking the "Save" button

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Zustand for state management
- Local Storage for persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

