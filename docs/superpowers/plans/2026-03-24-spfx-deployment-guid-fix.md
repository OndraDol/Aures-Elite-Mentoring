# SPFx Deployment GUID Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the SharePoint deployment failure caused by duplicate solution and feature IDs, then rebuild and document the Heft-based packaging workflow.

**Architecture:** Keep the fix narrowly scoped to SPFx packaging configuration and supporting regression coverage. Add one automated test that validates package manifest ID uniqueness, then update the solution metadata, regenerate the review export, and verify the produced `.sppkg`.

**Tech Stack:** SPFx 1.22.2, Heft, Jest via `@rushstack/heft-jest-plugin`, TypeScript, PowerShell

---

### Task 1: Capture the regression with an automated test

**Files:**
- Create: `src/config/packageSolution.test.js`
- Test: `src/config/packageSolution.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
'use strict';

const fs = require('fs');
const path = require('path');

describe('package solution manifest', () => {
  it('uses unique GUIDs for the solution and feature manifests', () => {
    const manifestPath = path.resolve(__dirname, '../../config/package-solution.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const featureIds = (manifest.solution.features || []).map((feature) => feature.id);
    const allIds = [manifest.solution.id, ...featureIds];

    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --test-path-pattern packageSolution.test`
Expected: FAIL because `solution.id` and `features[0].id` are identical.

- [ ] **Step 3: Write minimal implementation**

Update `config/package-solution.json` so every feature entry has its own stable GUID different from `solution.id`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --test-path-pattern packageSolution.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/config/packageSolution.test.js config/package-solution.json
git commit -m "fix: make SPFx feature manifest IDs unique"
```

### Task 2: Rebuild derived artifacts and verify the package

**Files:**
- Modify: `Create-ProHonzu.ps1` only if export generation needs adjustment
- Regenerate: `pro honzu/`
- Verify: `sharepoint/solution/aures-elite-mentoring.sppkg`

- [ ] **Step 1: Regenerate the review export**

Run: `powershell -ExecutionPolicy Bypass -File .\Create-ProHonzu.ps1`
Expected: export in `pro honzu/` matches the updated root configuration.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Build the deployment package with the Heft workflow**

Run: `npm run package`
Expected: PASS and produce `sharepoint/solution/aures-elite-mentoring.sppkg`

- [ ] **Step 5: Inspect the produced package**

Verify that the solution Product ID in `AppManifest.xml` differs from any feature ID present in the generated package contents.

- [ ] **Step 6: Commit**

```bash
git add pro\ honzu sharepoint/solution
git commit -m "build: regenerate review export and SPFx package"
```

### Task 3: Update project documentation for the fixed deployment workflow

**Files:**
- Modify: `README.md`
- Modify: `Claude.md`

- [ ] **Step 1: Update deployment notes**

Document the deployment pitfall and confirm that packaging is done via Heft (`npm run package`), not the legacy gulp workflow.

- [ ] **Step 2: Update verification guidance**

Document the expected output path and the requirement for unique GUIDs across solution and feature manifests.

- [ ] **Step 3: Re-run focused verification if docs mention commands**

Run: `npm run package`
Expected: PASS using the documented commands.

- [ ] **Step 4: Commit**

```bash
git add README.md Claude.md
git commit -m "docs: document Heft packaging and deployment validation"
```

### Task 4: Finalize and publish

**Files:**
- Verify: repository working tree

- [ ] **Step 1: Review git diff**

Run: `git diff --stat`
Expected: only intended config, test, docs, and generated export/package changes remain.

- [ ] **Step 2: Push the branch**

Run: `git push`
Expected: remote updated successfully.
