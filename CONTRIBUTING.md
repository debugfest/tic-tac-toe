# Contributing Guide

Thanks for your interest in improving Tic‑Tac‑Toe! This guide keeps contributions simple and consistent.

## Ways to Contribute
- Open issues (bugs, ideas, questions)
- Improve UI/UX (styles, accessibility, responsiveness)
- Add features (themes, animations, AI tweaks)
- Refactor/cleanup and small fixes
- Docs (README, comments, examples)

## Quick Start
```bash
git clone https://github.com/debugfest/tic-tac-toe.git
cd tic-tac-toe
npm install
npm run dev
```

Useful scripts:
```bash
npm run dev        # Start dev server (Vite + HMR)
npm run build      # Production build
npm run preview    # Preview build
```

## Workflow
1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feat/short-description
   # or fix/short-description, docs/short-description
   ```
2. Make focused changes and commit often with clear messages:
   - type(scope): short summary
   - Example: `fix(board): prevent clicks after game over`
3. Push your branch and open a Pull Request (PR).

## Coding Standards
- TypeScript + React 18
- Prefer readable, well‑named variables and small components
- Avoid deep nesting; use early returns
- Keep comments only for non‑obvious logic
- Tailwind CSS for styling; keep class lists tidy
- No unused variables/parameters (ESLint is strict)

### Project Conventions
- Components under `src/components/`
- Game logic under `src/utils/`
- Keep UI stateless where possible; isolate logic in helpers

## PR Checklist
- [ ] Runs locally: `npm run dev`
- [ ] Lints clean: `npm run lint`
- [ ] Type checks: `npm run typecheck`
- [ ] No unrelated file changes
- [ ] Screenshots/GIFs for UI changes (optional but helpful)
- [ ] Description explains the why + what

## Reporting Issues
Please include:
- What happened vs. expected behavior
- Steps to reproduce
- Environment (OS, browser)
- Screenshots if visual

## License
By contributing, you agree your contributions are licensed under the repository’s MIT license.

Thanks again for helping make Tic‑Tac‑Toe better!


