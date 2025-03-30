# VitNode Development Rules

## Tech Stack

### Frontend

- Next.js 15 - for server-side rendering and static site generation,
- React 19 - for building user interfaces,
- Tailwind 4 - for styling components,
- Shadcn UI 4 - for building UI components,
  - Shadcn UI is a collection of components built on top of Radix UI and Tailwind CSS,
  - It provides a set of pre-built components that are easy to use and customize,
  - It also provides a set of utility functions for building custom components,
- TypeScript 5 - for type safety and better developer experience,
- next-intl 4 - for internationalization and localization,
  - Type-safe translations,
  - In `apps/web/src/plugins/core/langs/{lang}.ts` file there are all available languages,
- lucide-react 5 - for icons,
- zod 3 - for schema validation,
- react-hook-form 7 - for form handling,

### Backend

- Hono.js 3 - for building lightweight api,
  - @hono/zod-openapi - for OpenAPI support,
- Drizzle ORM - for database interactions,

## Code structure

VitNode is a monorepo with the following structure:

- `apps/` - contains the frontend and backend applications,
  - `web/` - the frontend application,
  - `docs/` - the documentation application,
- `packages/` - contains shared libraries and components,
  - `eslint/` - custom ESLint configuration with Typescript,
  - `vitnode/` - shared components for `web/` project to create frontend & backend

## Coding practices

### Guidelines for clean code

- Use **ESLint** and **Prettier** for code formatting and linting.
