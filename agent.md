# Developer Agent Guide: Twilight Princess Tracker

This guide helps AI coding agents and developers understand the codebase architecture, data schemas, and setup for maintaining the Zelda Twilight Princess Collectibles Tracker.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database/Storage**: Local JSON file (`data/tracker-state.json`) managed via Next.js Route Handlers.

---

## File Structure

```
├── README.md               # User-facing project documentation
├── agent.md                # This developer/agent guide
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS config (required for Tailwind v4 inside Next.js)
├── data/
│   └── tracker-state.json  # Local JSON file where state is saved
├── public/
│   └── img/
│       ├── hearth/         # 45 heart piece images (400px-Tp_heart_XX.jpg)
│       └── souls/          # 60 poe soul images (PoeSoul_XX.jpg)
└── src/
    ├── app/
    │   ├── api/
    │   │   └── state/
    │   │       └── route.ts # GET and POST handlers for reading/saving progress
    │   ├── globals.css     # CSS Variables, Tailwind imports, scrollbars, and themes
    │   ├── layout.tsx      # App wrapper layout
    │   └── page.tsx        # Main tracker dashboard (Client Component)
    ├── data/
    │   ├── collectiblesData.ts # Data schemas and items database
    │   └── itemsData.ts    # Link's items and quest progress markers
    └── utils/
        └── directions.ts   # Helper to flip direction words for mirrored versions
```

---

## Key Design Patterns & Code Implementation

### 1. Data Models (`src/data/`)
- **Items**: Defined by the `Item` interface. Each item has a unique lowercase `id`, a French `name`, an English `englishName`, and a unicode `icon` character (e.g. `🔥` for Lantern).
- **Collectibles**: Defined by the `Collectible` interface.
  - `conditions` property uses **Disjunctive Normal Form (DNF)**: an array of arrays representing `(A AND B) OR (C AND D)`. For example, `[["bombs", "iron_boots"], ["boomerang"]]` means Link must have either (Bombs and Iron Boots) OR (Gale Boomerang) to obtain the item.
  - Optional `name` property is used exclusively by Golden Bugs since Heart Pieces and Poe Souls are identified by location and index.

### 2. State Persistence (`src/app/api/state/`)
- Managed using Next.js Route Handlers with node's `fs/promises`.
- Automatically initializes with `DEFAULT_STATE` if no state file exists.
- The state object schema:
  ```typescript
  interface TrackerState {
    selectedGame: string;
    checkedItems: string[];
    checkedCollectibles: string[];
  }
  ```

### 3. Direction Mirroring (`src/utils/directions.ts`)
- Implements a case-preserving replacement algorithm using regular expressions and whole-word matching (`\b`).
- Supported replacements:
  - `east` <-> `west`
  - `left` <-> `right`
  - `northeast` <-> `northwest`
  - `southeast` <-> `southwest`
  - `eastern` <-> `western`

---

## Maintenance & Commands

Ensure you always use Node.js v24. When running terminal commands, prepend the PATH override:
```bash
export PATH="$HOME/.nvm/versions/node/v24.10.0/bin:$PATH"
```

### Dev Mode
```bash
export PATH="$HOME/.nvm/versions/node/v24.10.0/bin:$PATH" && npm run dev
```

### Build & Type-Check
```bash
export PATH="$HOME/.nvm/versions/node/v24.10.0/bin:$PATH" && npm run build
```
