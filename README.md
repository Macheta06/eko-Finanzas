# Eko-Finanzas

Smart household expense sharing. Distribute expenses proportionally based on each member's income.

## Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Vite 7** — bundler
- **Tailwind CSS v4** — styling
- **Zustand 5** — state management (localStorage persistence)
- **Recharts** — data visualization
- **Lucide React** — icons
- **Supabase** — backend (coming soon)
- **Vitest** + **React Testing Library** — testing

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Copy `.env.local` to use Supabase features (optional — the app works fully offline):

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Architecture

```
src/
├── types/        # Domain models (Home, Member, Expense)
├── store/        # Zustand store with localStorage persistence
├── hooks/        # Business logic (useFinances facade)
├── components/   # UI views
├── services/     # External services (Supabase client)
└── test/         # Test setup and utilities
```

## Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

The project uses Vitest with React Testing Library. Tests live in `__tests__` directories next to the code they test.
