# Deal or No Deal

A modern, frontend-only web game inspired by the TV show **Deal or No Deal**. Built with React, TypeScript, and Vite — all game state runs entirely in the browser.

## Features

- **26 silver briefcases** with classic prize values ($0.01 – $1,000,000)
- **Full game flow**: pick your case → open cases in rounds → Banker offers → Deal or No Deal → final reveal
- **3D-style briefcases** — brushed silver metal texture, lid-flip animation, and in-case money reveal
- **Banker offer history** — sidebar panel tracking every offer by round, including bargained increases
- **One-time bargain** — negotiate with the Banker once per game for a potentially higher offer
- **Realistic Banker offers** based on expected value, round progression, and slight randomness
- **English & Chinese (中文)** — full UI translation with a header language toggle (persisted)
- **Polished UI** with glassmorphism, gold accents, and depth effects
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
| i18n | Custom translation hook (`en` / `zh`) |

## Project Structure

```
src/
├── components/
│   ├── BankerOfferModal.tsx   # Deal / No Deal + bargain
│   ├── CaseGrid.tsx
│   ├── CaseTile.tsx           # Silver briefcase tiles
│   ├── FinalChoiceModal.tsx
│   ├── GameBoard.tsx
│   ├── GameStatus.tsx
│   ├── Header.tsx             # Theme, sound, language toggles
│   ├── OfferHistory.tsx       # Banker offer history panel
│   ├── OutcomeScreen.tsx
│   ├── RevealOverlay.tsx
│   ├── ValueBoard.tsx
│   └── WelcomeScreen.tsx
├── hooks/
│   ├── useLocale.ts           # Syncs `lang` attribute to DOM
│   ├── useSound.ts            # Web Audio sound effects
│   └── useTheme.ts            # Theme sync to DOM
├── i18n/
│   ├── translations.ts        # English & Chinese strings
│   └── useTranslation.ts
├── store/
│   ├── gameStore.ts           # Game state (Zustand)
│   └── settingsStore.ts       # Theme, locale & sound prefs
├── types/
│   └── game.ts
├── utils/
│   ├── bankerOffer.ts         # Offer & bargain calculation
│   ├── constants.ts           # Prize values & round config
│   ├── formatCurrency.ts      # Currency & compact tile formatting
│   ├── gameLogic.ts           # Case creation & helpers
│   └── shuffle.ts             # Fisher-Yates shuffle
├── App.tsx
├── App.css
├── index.css                  # Global styles, theme & briefcase tokens
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

## Deploy to Vercel

This project is configured for [Vercel](https://vercel.com) with `vercel.json` (Vite build → `dist`).

### Option A — Vercel CLI (fastest)

```bash
# One-time login
npx vercel login

# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

### Option B — Git integration

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Vercel auto-detects Vite — no extra settings needed
4. Click **Deploy**

**Live site:** [https://dealornotdeal-bice.vercel.app](https://dealornotdeal-bice.vercel.app)

## How to Play

1. Click **Start New Game**
2. **Select one briefcase** — this is yours for the entire game
3. Each **round**, open the required number of other briefcases (watch the lid flip and reveal the amount inside)
4. After each round, the **Banker makes an offer** — accept (**Deal**), continue (**No Deal**), or **Bargain** once per game
5. Review past offers anytime in the **Offer History** sidebar
6. When only two cases remain, choose to **keep or swap**
7. See your final winnings on the outcome screen

## Language

Use the **EN / 中** button in the header to switch between English and Chinese. Your preference is saved in `localStorage`.

- UI strings, status messages, and modals are fully translated
- Prize amounts stay in USD; Chinese mode uses compact formats where helpful (e.g. `$100万` on small briefcase tiles)
- Hover a briefcase tile to see the full formatted amount

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

### Bargain (One Time Per Game)

When an offer appears, you may press **Bargain** once. The Banker may:

| Outcome | Approx. chance | Result |
|---------|----------------|--------|
| Improved | ~60% | Offer raised 8–18% |
| Small bump | ~10% | Offer raised 3–7% |
| Refused | ~25% | Offer unchanged |

Successful bargains are recorded in **Offer History** with the original amount struck through.

### Briefcase Display

Opened briefcases show a compact amount on the tile to prevent overflow (e.g. `$1M` instead of `$1,000,000`). The full value is always shown in the reveal overlay and on hover.

## License

MIT
