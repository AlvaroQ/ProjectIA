# ProjectIA - Claude Code Configuration

## Project Overview
This is a Next.js 16 project with TypeScript, Tailwind CSS v4, and shadcn/ui components.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **React**: v19

## Project Structure
```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components (create as needed)
│   └── ui/        # shadcn/ui components (auto-generated)
└── lib/           # Utility functions
    └── utils.ts   # cn() helper for class merging
```

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding shadcn/ui Components
```bash
npx shadcn@latest add <component-name>
```

Example: `npx shadcn@latest add button card input`

## Code Conventions
- Use TypeScript strict mode
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Place reusable components in `src/components/`
- Use Server Components by default, add "use client" only when needed
- Follow Next.js App Router conventions for routing

## Path Aliases
- `@/*` maps to `src/*`

## Notes for Claude
- When creating new components, check if shadcn/ui has a similar component first
- Prefer Server Components for data fetching
- Use Tailwind CSS classes for styling
- Keep components small and focused
