# Claude.md

## Tech stack

- SPFx `1.22.2`
- Node.js `22.x`
- Heft + ejected Webpack
- React `17.0.1`
- TypeScript `5.8.x`

## Příkazy

```bash
npm install
npm run start
npm test
npm test -- --test-path-pattern packageSolution.test
npm run build
npm run package
npm audit
```

## Kvalitní požadavky

Každá změna musí zachovat:

- SPFx `1.22.x`
- Node `22.x`
- `npm audit` bez nalezených zranitelností
- unikátní GUID napříč `solution.id` a `solution.features[*].id` v `config/package-solution.json`
- packaging a deploy ověření přes Heft (`npm run package`), ne přes legacy gulp workflow

## Provozní poznámka

- Nové mentory přidávej přímo do listu `Mentors`.
- Mentory nemaž přes HR UI `Smazat`; pro vyřazení použij deaktivaci přes `IsActive`.
