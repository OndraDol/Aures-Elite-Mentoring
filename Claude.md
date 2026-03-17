# CLAUDE.md — Aures Elite Mentoring

## Current Technical Baseline

- SPFx `1.22.2`
- Node.js `22.x`
- TypeScript `5.3.x`
- React `17.0.1`
- `@pnp/sp` v4

## Current Functional Baseline

- Talent, Mentor and HR flows are implemented.
- Workflow logic lives in client code and SharePoint lists.
- `NotificationService` is intentionally a no-op stub for future Power Automate integration.
- HR access is controlled by configured `hrEmails`.

## SharePoint Testing Mode

With no approved `.sppkg` yet:

- use `gulp serve` / hosted workbench for integration testing
- validate real SharePoint list schema and permissions
- verify real user-role behavior in the test site

Without App Catalog approval:

- the webpart cannot be added as a standard deployed component to normal pages
- production users cannot use the final deployed experience yet

## Keep in Sync

If project facts change, update:

- `README.md`
- `PROGRESS.md`
- `Project_overview.md`
- this file
