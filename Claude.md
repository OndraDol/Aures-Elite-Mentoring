# Claude.md

## Tech stack

- SPFx `1.22.2`
- Node.js `22.x`
- Heft + ejected Webpack
- React `17.0.1`
- TypeScript `5.8.x`

## Prikazy

```bash
npm install
npm run start
npm test
npm test -- --test-path-pattern packageSolution.test
npm run build
npm run package
npm audit
```

## Kvalitni pozadavky

Kazda zmena musi zachovat:

- SPFx `1.22.x`
- Node `22.x`
- `npm audit` bez nalezenych zranitelnosti
- unikatni GUID napric `solution.id` a `solution.features[*].id` v `config/package-solution.json`
- packaging a deploy overeni pres Heft (`npm run package`), ne pres legacy gulp workflow
