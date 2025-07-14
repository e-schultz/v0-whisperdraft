# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2023-04-02

### Added
- WHISPERDRAFT-001 MINOR Added README.md with project overview, features, and usage instructions
- WHISPERDRAFT-002 MINOR Added CHANGELOG.md to track project changes
- WHISPERDRAFT-003 MINOR Added debug panel with buttons to manually trigger saves, add test messages, and log state
- WHISPERDRAFT-004 MINOR Added console logging throughout the application to track data flow
- WHISPERDRAFT-005 MINOR Added visibility checking to ensure chat container is visible
- WHISPERDRAFT-006 MINOR Added auto-scrolling to new messages in chat panel
- WHISPERDRAFT-007 MINOR Added test button to chat header for easy message rendering verification
- WHISPERDRAFT-008 MINOR Added loading state to ensure app only renders after initialization
- WHISPERDRAFT-009 MINOR Added last save timestamp indicator to editor
- WHISPERDRAFT-010 MINOR Added storage quota handling to manage localStorage limits
- WHISPERDRAFT-028 MINOR Added Framer Motion animations for improved UI interactions
- WHISPERDRAFT-029 MINOR Added spring animations for panel transitions
- WHISPERDRAFT-030 MINOR Added animated tooltips with improved visibility

### Changed
- WHISPERDRAFT-011 PATCH Enhanced store initialization with async functions and better error handling
- WHISPERDRAFT-012 PATCH Improved storage utility with better error handling and operation logging
- WHISPERDRAFT-013 PATCH Enhanced auto-save timer with improved error handling and logging
- WHISPERDRAFT-014 PATCH Improved LLM service with better error handling and response logging
- WHISPERDRAFT-031 PATCH Enhanced mobile experience with animated swipe indicators
- WHISPERDRAFT-032 PATCH Improved desktop panel resizing with smoother animations
- WHISPERDRAFT-033 PATCH Condensed UI elements while maintaining animation quality

### Fixed
- WHISPERDRAFT-015 MAJOR Fixed chat message rendering to ensure messages are properly displayed
- WHISPERDRAFT-016 MAJOR Fixed diff generation logic to ensure changes are properly detected
- WHISPERDRAFT-017 MAJOR Fixed auto-save functionality to properly trigger diff generation
- WHISPERDRAFT-018 MAJOR Fixed mobile experience to ensure chat panel is properly displayed
- WHISPERDRAFT-019 MAJOR Fixed initialization sequence to ensure proper data loading
- WHISPERDRAFT-034 MAJOR Fixed keyboard shortcuts functionality, particularly Ctrl+\ for toggling panels
- WHISPERDRAFT-035 MAJOR Fixed animation conflicts between CSS transitions and Framer Motion
- WHISPERDRAFT-036 MAJOR Fixed panel transition issues when resizing
- WHISPERDRAFT-037 MAJOR Fixed mobile swipe gesture detection and animation

## [0.1.0] - 2023-03-15

### Added
- WHISPERDRAFT-020 MAJOR Initial release of Whisperdraft
- WHISPERDRAFT-021 MAJOR Two-pane layout with note editor and AI response panel
- WHISPERDRAFT-022 MAJOR Local storage persistence for notes and chat history
- WHISPERDRAFT-023 MAJOR Diff tracking between note versions
- WHISPERDRAFT-024 MAJOR Basic responsive design
- WHISPERDRAFT-025 MINOR Dark mode toggle
- WHISPERDRAFT-026 MINOR Auto-save functionality
- WHISPERDRAFT-027 MINOR Export functionality for notes and chat history

