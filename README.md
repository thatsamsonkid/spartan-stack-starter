# Spartan Stack Starter

✨ **An Opinionated Template Project Starter using Spartan Stack** ✨

## Tech Stack

- [Spartan UI](https://www.spartan.ng/) - UI
- [Supabase](https://supabase.com/) - Database
- [Drizzle](https://orm.drizzle.team/) - ORM (The P is silent)
- [Angular](https://angular.dev/) - UI Framework
- [RxJs](https://rxjs.dev/) Needed an R tech but still very useful!
- [tRPC](https://trpc.io/) - Type Safety
- [TailwindCSS](https://tailwindcss.com/) - Styles
- [Analogjs](https://analogjs.org/) - Angular SSR Meta-framwork
- [NgRx Signals](https://ngrx.io/guide/signals) - State Management

## Get Started

1. Clone the repo
2. Install deps with `pnpm install`
3. Create a supabase project at [Supabase](https://supabase.com/)
4. Create a .env file at root fill in supabase project id and pub key vars
5. Run `pnpm run db:push`- will populate your supabase db with defined drizzle schemas located `apps/app/src/server/db/schema.ts`
6. Run `pnpm run start` - starts the app
