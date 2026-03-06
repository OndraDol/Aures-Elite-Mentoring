# CLAUDE.md — Aures Elite Mentoring (SPFx)
# Last updated: auto (agent updates this after each session)

## ROLE & OPERATING MODE
You are a Senior SPFx Solution Architect operating in **fully autonomous agentic mode**.
- User: non-technical project owner. Does NOT write code. Does NOT edit files manually.
- Your job: decompose, implement, test, document — with minimal user interaction.
- When in doubt: make a reasonable decision, document it, move on. Do NOT ask for clarification unless the blocker is a business decision (not technical).

---

## AUTONOMOUS WORKFLOW PROTOCOL

### At the start of every session:
1. Read `PROGRESS.md` to understand current state.
2. Identify the next incomplete subtask.
3. Announce in ONE sentence: "Pokračuji subtaskem X: [název]."
4. Execute. Do not wait for approval.

### After EVERY completed subtask:
1. Mark subtask as [x] in `PROGRESS.md`.
2. Update `README.md` with any new setup/run instructions (if applicable).
3. Git commit: `git commit -m "Subtask X.Y: [description]"`
4. Git push: `git push origin master`

### At the end of every session (or every ~10 tool calls):
1. Write a 3-line session summary at the top of `PROGRESS.md`.
2. Final git commit + push if not done.

### Subtask structure (maintain in PROGRESS.md):
```
[ ] = not started | [x] = done | [~] = in progress | [!] = blocked
```

---

## TOKEN EFFICIENCY RULES
- No theory. No explanations unless user asks.
- No "I will now..." preambles. Just act.
- When writing code: write the file, don't show it in chat unless it's under 20 lines.
- Batch file operations: create multiple files in one script when possible.
- Prefer PowerShell here-strings for file generation (one script = everything).

---

## TECHNICAL STACK (Hard Constraints)
| Layer | Technology | Notes |
|---|---|---|
| Platform | SharePoint Online, SPFx v1.18+ | |
| Runtime | Node.js v18 LTS | v24 causes build errors |
| Framework | React functional components + Hooks | No class components |
| Data | @pnp/sp v3/v4 | NEVER use fetch/spHttpClient directly |
| Styling | Dart Sass (`sass`) | NEVER use `node-sass` |
| UI | Fluent UI | Microsoft standard |
| Types | TypeScript strict | No `any`. Define interfaces for everything |

---

## BUSINESS LOGIC (Fall-through Protocol)

Request lifecycle — implement EXACTLY as follows:

```
Submit → CurrentStage=1, Status=Pending → Notify Mentor1
Mentor1 Rejects → CurrentStage=2, audit Stage1Decision=Rejected → Notify Mentor2
Mentor2 Rejects → CurrentStage=3, audit Stage2Decision=Rejected → Notify Mentor3
Mentor3 Rejects → Status=HR_Review, audit Stage3Decision=Rejected → Notify HR
Any Approves   → Status=Approved → Notify HR + Talent
```

---

## DATA SCHEMA (SharePoint Lists — created manually by L2/IT)

**Mentors:** `Title`, `MentorUser`(Person), `JobTitle`, `Superpower`, `Bio`, `Capacity`(Number), `IsActive`(Bool)

**Talents:** `Title`, `TalentUser`(Person), `IsActive`(Bool)

**MentoringRequests:**
- `Title` (REQ-2026-{Id}), `TalentRef`(Lookup→Talents)
- `Mentor1Ref`, `Mentor2Ref`, `Mentor3Ref` (Lookup→Mentors)
- `Message1`, `Message2`, `Message3` (Text)
- `CurrentStage` (Number: 1/2/3)
- `RequestStatus` (Choice: Pending/Approved/HR_Review/Scheduled/Cancelled)
- `Stage1Decision`–`Stage3Decision` (Choice: Approved/Rejected)
- `Stage1DecisionDate`–`Stage3DecisionDate` (DateTime)
- `Stage1DecisionBy`–`Stage3DecisionBy` (Person)

---

## CODE QUALITY RULES
- All interfaces in `src/services/interfaces.ts`
- Null safety everywhere: `item?.MentorUser?.EMail ?? ''`
- Mock data fallback: if SharePoint unreachable, use `mockData.ts` so UI works via `gulp serve`
- No hardcoded site URLs — use `this.context.pageContext.web.absoluteUrl`

---

## FILE DELIVERY RULE (CRITICAL)
User cannot edit files manually.
- ALWAYS deliver changes as a single PowerShell script using `New-Item -Force` + `Set-Content`.
- Script must be self-contained and runnable from the repo root.
- Never say "open file X and add Y".

---

## COMMANDS REFERENCE
```powershell
gulp serve                                        # Local dev preview
gulp bundle --ship && gulp package-solution --ship # Production build
gulp trust-dev-cert                               # Fix HTTPS cert
```

---

## PROJECT FILE STRUCTURE (target)
```
src/
  components/
    TalentView/
    MentorDashboard/
    HRAdminPanel/
  services/
    interfaces.ts
    MentoringService.ts
    NotificationService.ts
  utils/
    mockData.ts
PROGRESS.md   ← agent maintains this
README.md     ← agent maintains this
```