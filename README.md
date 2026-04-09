# Portfolio site

Personal portfolio built with **Next.js 14** (App Router) and **Prismic** as the headless CMS. Content is modeled as **slices** and composed on the homepage and other document types; the UI uses **Tailwind CSS**, **GSAP** for motion, and **React Three Fiber** / **Three.js** for 3D elements.

## Stack

- [Next.js 14](https://nextjs.org/) — React, App Router, API routes for Prismic preview and revalidation
- [Prismic](https://prismic.io/) — `@prismicio/client`, `@prismicio/next`, `@prismicio/react`
- [Slice Machine](https://prismic.io/docs/slice-machine) — local slice development and types
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [GSAP](https://gsap.com/) — animations
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Three.js](https://threejs.org/) — 3D graphics

## Prerequisites

- **Node.js** (LTS recommended)
- A **Prismic repository** linked to this project. The repository name used at runtime comes from `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` or from `repositoryName` in `slicemachine.config.json` (whichever you configure for your fork).

## Environment

Do **not** commit API keys, access tokens, webhook secrets, or `.env.local` (keep those only on your machine and in your host’s secret store).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | No | Prismic repository name override. If unset, the client uses `repositoryName` from `slicemachine.config.json`. |

Example (values are placeholders):

```bash
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your-prismic-repo-name
```

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run slicemachine` | Start [Slice Machine](https://prismic.io/docs/slice-machine) UI for editing slice models |

## Content & routes

- **Homepage** — Prismic singleton `homepage`; rendered with `SliceZone` in `src/app/page.tsx`.
- **Generic pages** — `src/app/[uid]/page.tsx` for documents of type `page`.
- **Blog** — `src/app/blog/[uid]/page.tsx`
- **Projects** — `src/app/projects/[uid]/page.tsx`

Route resolvers for Prismic URLs live in `src/prismicio.ts`. Update the `routes` array there if you add document types or change URL patterns.

**Slices** live under `src/slices/` (Hero, Biography, Experience, TechList, etc.). Types are generated into `prismicio-types.d.ts` when you use Slice Machine.

**Slice Simulator** — [http://localhost:3000/slice-simulator](http://localhost:3000/slice-simulator) (dev) for previewing slices in isolation.

## Prismic preview & revalidation

- Preview is enabled via `PrismicPreview` in `src/app/layout.tsx` and the preview API route under `src/app/api/preview/`.
- On-demand revalidation uses the `prismic` cache tag (`src/app/api/revalidate/route.ts`). If you expose that URL on the public internet, **protect it** (for example verify a shared secret from your webhook or restrict invocations to your host’s trusted paths)—otherwise anyone could trigger revalidation.

## Deploy

The app is a standard Next.js deployment (e.g. [Vercel](https://vercel.com/docs)). Set environment variables only in the hosting provider’s dashboard (not in the repo). Configure Prismic preview URLs and any revalidate webhook to match your production domain.
