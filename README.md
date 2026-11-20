# English Around the World

An English learning portal for Haarlem College, built with React, TypeScript, Vite and Supabase Auth.

## Run
```
npm ci
npm run dev
npm run build
```

Vercel: Vite preset, build `npm run build`, output directory `dist`.

## Accounts and publication
See [account setup and deployment](docs/account-portal.md). The database and account-management function are configured; the first teacher account and the GitHub/Vercel publication still need completion.

Public visitors can browse the start page and destination overview. Opening destinations, lessons, progress, passport and account settings requires an active account. Teachers have access to all module previews and teacher tools. Database policies enforce ownership and teacher authorization independently of the interface.

The public project configuration in `src/auth/publicConfig.ts` may be overridden with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never expose a service-role key in browser code.

Five destinations are configured. Three inline Singapore activities and one external Hub are linked; other entries are mostly planned content. Passport stamps are awarded by teachers. Photo credits are included in the website footer.

See [the visual audit](docs/website-audit.md) for the earlier review; its nickname-based storage description is superseded by the account portal.
