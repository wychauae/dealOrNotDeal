# Deal or No Deal

A modern, frontend-only web game inspired by the TV show **Deal or No Deal**. Built with React, TypeScript, and Vite — all game state runs entirely in the browser.

## Features

- **26 briefcases** with classic prize values ($0.01 – $1,000,000)
- **Full game flow**: pick your case → open cases in rounds → Banker offers → Deal or No Deal → final reveal
- **Realistic Banker offers** based on expected value, round progression, and slight randomness
- **Polished UI** with glassmorphism, gold gradients, and depth effects
- **Dark & light mode** with persistent preference
- **Optional sound effects** (Web Audio API, toggleable)
- **Framer Motion animations** for reveals, offers, and transitions
- **Fully responsive** — mobile-first layout
- **Accessible** — ARIA labels, keyboard navigation, high contrast

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| State | Zustand |
| Animation | Framer Motion |
| Styling | CSS Modules + CSS Variables |

## Project Structure

```
src/
├── components/          # UI components
│   ├── BankerOfferModal.tsx
│   ├── CaseGrid.tsx
│   ├── CaseTile.tsx
│   ├── FinalChoiceModal.tsx
│   ├── GameBoard.tsx
│   ├── GameStatus.tsx
│   ├── Header.tsx
│   ├── OutcomeScreen.tsx
│   ├── RevealOverlay.tsx
│   ├── ValueBoard.tsx
│   └── WelcomeScreen.tsx
├── hooks/
│   ├── useSound.ts      # Web Audio sound effects
│   └── useTheme.ts      # Theme sync to DOM
├── store/
│   ├── gameStore.ts     # Game state (Zustand)
│   └── settingsStore.ts # Theme & sound prefs
├── types/
│   └── game.ts          # TypeScript interfaces
├── utils/
│   ├── bankerOffer.ts   # Offer calculation logic
│   ├── constants.ts     # Prize values & round config
│   ├── gameLogic.ts     # Case creation & helpers
│   └── shuffle.ts       # Fisher-Yates shuffle
├── App.tsx
├── App.css
├── index.css            # Global styles & theme tokens
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm (or yarn/pnpm)

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

## How to Play

1. Click **Start New Game**
2. **Select one briefcase** — this is yours for the entire game
3. Each **round**, open the required number of other briefcases
4. After each round, the **Banker makes an offer** — accept (**Deal**) or continue (**No Deal**)
5. When only two cases remain, choose to **keep or swap**
6. See your final winnings on the outcome screen

## Game Logic

### Prize Distribution

26 values matching the US TV show are shuffled randomly using Fisher-Yates, ensuring fair distribution each game.

### Round Structure

| Round | Cases to Open |
|-------|--------------|
| 1 | 6 |
| 2 | 5 |
| 3 | 4 |
| 4 | 3 |
| 5 | 3 |
| 6 | 2 |
| 7+ | 1 each |

### Banker Offer Formula

```
offer = expectedValue × roundMultiplier × variance(0.94–1.06)
```

Multipliers increase each round (22% → 99%), so offers become more generous as fewer cases remain.

## License

MIT
