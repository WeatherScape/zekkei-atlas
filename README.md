# ZEKKEI ATLAS

ZEKKEI ATLAS is a premium scenic travel map built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and local mock data.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy To Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example `https://your-project.vercel.app`.
4. Deploy with the default Next.js settings.

Vercel will run:

```bash
npm install
npm run build
```

## Routes

- `/` - Immersive landing page
- `/map` - Filterable scenic map explorer
- `/spots/[id]` - Scenic spot detail pages
- `/wishlist` - LocalStorage wishlist
- `/ai-planner` - Mock AI travel planner
