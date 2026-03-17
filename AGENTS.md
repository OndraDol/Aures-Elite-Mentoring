# AGENTS.md — Aures Elite Mentoring

## Project Facts

- Platform: SharePoint Online, SPFx `1.22.2`
- Runtime: Node.js `22.x`
- Framework: React `17.0.1`, TypeScript `5.3.x`
- Data access: `@pnp/sp` v4
- Styling: Dart Sass
- Active mail transport: none
- Notification strategy: `NotificationService` stub reserved for future Power Automate integration

## Current Business Rules

- Talent creates one request with up to three mentor priorities.
- Request starts as `Pending`, `CurrentStage = 1`.
- Reject on stage 1 falls through to mentor 2 if present.
- Reject on stage 1 or 2 falls through to mentor 3 if present.
- Reject on the last available stage moves request to `HR_Review`.
- Any approve moves request to `Approved`.
- HR can move approved or reviewed requests to `Scheduled` or `Cancelled`.

## SharePoint Constraints

- Required lists: `Mentors`, `Talents`, `MentoringRequests`
- Internal field names must stay aligned with `src/services/MentoringService.ts`
- HR role is resolved from the configured `hrEmails` property, not from a SharePoint group

## Testing Reality

- Test and production SharePoint sites already exist.
- Until `.sppkg` is approved in App Catalog, meaningful testing happens through hosted workbench with localhost debug manifests.
- This is sufficient for validating UI, roles, data reads/writes and workflow logic against real SharePoint data.

## Delivery Constraint

- Keep documentation aligned with code.
- Do not reintroduce `sendEmail`, Graph mail or outdated SPFx/Node versions into docs or code.
