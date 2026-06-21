# Developer Agent Guide: Twilight Princess Tracker

This guide helps AI coding agents and developers understand the codebase architecture, data schemas, and setup for maintaining the Zelda Twilight Princess Collectibles Tracker.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: RGDS design system via `@rgds/core` tokens/classes and `@rgds/react` components, with custom CSS only when needed.
- **Auth**: Auth.js / NextAuth v5 with Google OAuth, credentials, and experimental passkeys.
- **Database/Storage**: Neon Postgres when `DATABASE_URL` or `POSTGRES_URL` is present. Tracker local fallback still uses SQLite (`data/tracker.db`) for non-auth local development, but production auth requires Neon.
- **Security**: Account email and username are encrypted with AES-256-GCM using keys derived from `AUTH_SECRET`; email lookup uses HMAC-SHA256; credential passwords use Argon2id.

---

## File Structure

```
├── README.md               # User-facing project documentation
├── agent.md                # This developer/agent guide
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS config (required for Tailwind v4 inside Next.js)
├── public/
│   └── img/
│       ├── hearth/         # 45 heart piece images (400px-Tp_heart_XX.jpg)
│       └── souls/          # 60 poe soul images (PoeSoul_XX.jpg)
└── src/
    ├── app/
    │   ├── api/
    │   │   └── state/
    │   │       └── route.ts # GET and POST handlers for reading/saving progress
    │   │   └── auth/
    │   │       ├── [...nextauth]/route.ts # Auth.js handlers
    │   │       └── signup/route.ts        # Credentials account creation
    │   │   └── account/
    │   │       └── route.ts # Account profile update/read API
    │   │   └── avatar/
    │   │       └── route.ts # DiceBear fallback and WebP upload API
    │   ├── account/
    │   │   └── page.tsx     # Account settings page
    │   ├── login/
    │   │   └── page.tsx     # Sign-in/sign-up page
    │   ├── zelda-tp/
    │   │   ├── page.tsx     # Twilight Princess tracker default route
    │   │   └── [tab]/
    │   │       └── page.tsx # Twilight Princess tracker tab routes
    │   ├── [tab]/
    │   │   └── page.tsx     # Legacy redirects to /zelda-tp/[tab]
    │   ├── globals.css     # CSS Variables, Tailwind imports, scrollbars, and themes
    │   ├── layout.tsx      # App wrapper layout
    │   └── page.tsx        # Game list landing page
    ├── data/
    │   ├── collectiblesData.ts # Data schemas and items database
    │   ├── gamesData.ts    # Game catalog entries for the landing page
    │   └── itemsData.ts    # Link's items and quest progress markers
    ├── components/
    │   ├── AccountPanel.tsx # Account settings client UI
    │   ├── LoginPanel.tsx   # Auth client UI
    │   └── TrackerDashboard.tsx # Main tracker dashboard (Client Component)
    ├── db/
    │   └── authSchema.ts    # Drizzle table definitions for Auth.js
    ├── utils/
    │   ├── authAdapter.ts   # Auth.js adapter wrapper for encrypted fields
    │   ├── authDb.ts        # Drizzle Neon client
    │   ├── db.ts           # State persistence abstraction
    │   └── directions.ts   # Helper to flip direction words for mirrored versions
    │   └── secureFields.ts  # AES-GCM, HMAC lookup, Argon2id helpers
```

---

## Key Design Patterns & Code Implementation

### 0. Design System
- Respect the RGDS design system first: use `@rgds/core` classes/tokens and `@rgds/react` components as much as possible.
- When RGDS does not provide a matching block or component, custom CSS is allowed, but it must stay visually aligned with the existing RGDS-based interface.

### 1. Data Models (`src/data/`)
- **Items**: Defined by the `Item` interface. Each item has a unique lowercase `id`, a French `name`, an English `englishName`, and a unicode `icon` character (e.g. `🔥` for Lantern).
- **Collectibles**: Defined by the `Collectible` interface.
  - `conditions` property uses **Disjunctive Normal Form (DNF)**: an array of arrays representing `(A AND B) OR (C AND D)`. For example, `[["bombs", "iron_boots"], ["boomerang"]]` means Link must have either (Bombs and Iron Boots) OR (Gale Boomerang) to obtain the item.
  - Optional `name` property is used exclusively by Golden Bugs since Heart Pieces and Poe Souls are identified by location and index.
- **Games**: `src/data/gamesData.ts` defines the game catalog shown on `/`. New games should be added there with a stable `slug`, `href`, title, subtitle, description, thumbnail, and status.

### 2. State Persistence (`src/app/api/state/`)
- Managed using Next.js Route Handlers.
- `src/utils/db.ts` initializes the `user_states` table automatically.
- State is keyed by `session.user.id` from Auth.js. The old anonymous `rg_gt_user_id` cookie flow is intentionally replaced.
- `/api/state` returns `401` without an authenticated session.
- The state object schema:
  ```typescript
  interface TrackerState {
    selectedGame: string;
    checkedItems: string[];
    checkedCollectibles: string[];
    checkedRegions: string[];
  }
  ```

### 3. Routing & Multi-Game Shell
- `/` is a game list landing page.
- `/login` is the required sign-in/sign-up page. Users without a session are redirected here before seeing the tracker.
- `/account` lets the user update username, email, password, passkeys, and avatar.
- `/zelda-tp` opens the Twilight Princess tracker on the inventory tab.
- `/zelda-tp/[tab]` opens a tracker tab. Valid tabs are `inventory`, `hearth`, `souls`, `bugs`, and `zones`.
- Legacy top-level tab routes (`/inventory`, `/hearth`, `/souls`, `/bugs`, `/zones`) redirect to `/zelda-tp/[tab]`.
- `TrackerDashboard` receives a `basePath` prop and must use it when changing tabs.

### 4. Auth & Account Security
- Auth.js uses `AUTH_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` in Vercel. Do not hardcode secrets.
- Auth sessions use JWT strategy. This avoids storing per-session rows while users, linked providers, passkeys, and credentials metadata remain in Neon.
- Google OAuth stores only the provider link needed to recover the user. OAuth access/id/refresh tokens and Google profile images are intentionally not persisted.
- Credentials users are created through `/api/auth/signup`. Passwords are Argon2id hashes, never encrypted or reversible.
- Email and username are stored encrypted. `email_hash` is a deterministic HMAC index used for lookup and uniqueness.
- Passkeys use Auth.js' experimental WebAuthn support and the Authenticator table.

### 5. Avatars
- `/api/avatar` returns an uploaded WebP avatar when present.
- If no avatar was uploaded, `/api/avatar` redirects to DiceBear 10.x with a seed based on the decrypted username/email.
- Uploaded avatars are converted backend-side to 256x256 WebP via `sharp` and stored in Neon as `avatar_webp`.

### 6. Import / Export
- `TrackerDashboard` exposes RGDS-based buttons to export and import tracker data.
- Export format is JSON:
  ```json
  {
    "schemaVersion": 1,
    "gameSlug": "zelda-tp",
    "exportedAt": "ISO timestamp",
    "state": {
      "selectedGame": "tp-gcn",
      "checkedItems": [],
      "checkedCollectibles": [],
      "checkedRegions": []
    }
  }
  ```
- Import accepts either this wrapped format or a raw `TrackerState` object, then saves it through `/api/state`.
- Existing pre-auth exports remain valid: after login, importing one writes the imported state into the authenticated account.

### 7. Direction Mirroring (`src/utils/directions.ts`)
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
