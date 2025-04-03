# Whisperdraft Development Roadmap

This document outlines the planned development roadmap for Whisperdraft. It serves as a guide for contributors to understand the project's direction and priorities.

## Current Focus

- **Editor Stability and Performance**: Continuing to optimize the TipTap editor implementation
- **Mobile Experience**: Improving the mobile writing experience with better touch interactions
- **AI Response Quality**: Refining the AI prompting system for more helpful responses

## Short-term Goals (Next 3 Months)

1. **Implement true swipeable panels** for mobile users as specified in the architecture
2. **Reduce complexity in the AI service layer** to better align with the minimalist philosophy
3. **Consolidate Settings Management**: Resolve any redundancy in settings implementations
4. **Add mechanism to squash older diffs** into summaries for context accumulation

## Medium-term Goals (3-6 Months)

1. **Enhanced Markdown Support**:
   - Add visual feedback when Markdown shortcuts are recognized
   - Support more Markdown shortcuts (`#` for headings, `>` for blockquotes, etc.)
   - Add a Markdown cheat sheet with common shortcuts

2. **Improved Accessibility**:
   - Ensure full keyboard navigation
   - Improve screen reader support
   - Add high contrast mode

3. **Performance Optimizations**:
   - Optimize rendering for large documents
   - Improve diff generation algorithm
   - Reduce unnecessary re-renders

## Long-term Vision (6+ Months)

1. **Optional Cloud Sync**: Add optional synchronization while maintaining local-first approach
2. **Collaborative Features**: Explore ways to enable collaboration without compromising simplicity
3. **Extensibility**: Create a plugin system for extending functionality

## Contribution Opportunities

If you're interested in contributing, these areas would be particularly valuable:

1. **Mobile UI Improvements**: Help implement the swipeable panels for mobile
2. **Testing Infrastructure**: Help set up automated testing
3. **Documentation**: Expand and improve documentation
4. **Accessibility**: Improve keyboard navigation and screen reader support

Please check the GitHub issues for specific tasks related to these goals.

