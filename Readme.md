# ❌⭕ Tic-Tac-Toe

A clean, modern Tic-Tac-Toe game with instant interactions, smart win detection, and a polished UI. Play against a friend locally and track wins with a simple scoreboard.

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://javascript.info)
[![HTML5](https://img.shields.io/badge/HTML5-Semantics-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

- **Two-Player Local**: Alternate turns as X and O
- **Instant Feedback**: Highlights winning line and ends the round
- **Scoreboard**: Tracks X wins, O wins, and draws
- **Reset/Restart**: Clear board or reset the entire match
- **Responsive UI**: Looks great on desktop and mobile
- **Accessible Controls**: Play with mouse/touch and keyboard

## 🛠️ Technology Stack

- **Build Tool**: Vite 5.0+
- **Frontend**: Vanilla JavaScript (ES6+)
- **UI**: Semantic HTML + modern CSS
- **Dev Experience**: Hot Module Replacement (HMR)

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

## 🚀 Quick Start

```bash
git clone https://github.com/debugfest/tic-tac-toe.git
cd tic-tac-toe

# install deps
npm install

# start dev server
npm run dev

# open the URL from the terminal (usually http://localhost:5173)
```

## 📁 Project Structure

```
tic-tac-toe/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── css/                # Styles
│   ├── js/                 # Game logic (board, rules, UI bindings)
│   └── main.js             # App entry
├── index.html              # Main HTML
├── package.json            # Scripts and deps
├── vite.config.js          # Vite config (optional)
└── Readme.md               # This file
```

## 🎮 How to Play

### Controls
- Click or tap a square to place your mark
- Keyboard: Use arrow keys to move focus, Enter/Space to place

### Rules
1. Players alternate turns: X goes first
2. First to align 3 marks in a row, column, or diagonal wins
3. If all 9 squares are filled with no winner, it’s a draw

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run linting (if configured)
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request with improvements, new features (e.g., AI opponent, themes), or fixes.



<div align="center">

**⭐ If you enjoy this project, please give it a star! ⭐**

Made with ❤️ — Have fun playing Tic‑Tac‑Toe!

</div>