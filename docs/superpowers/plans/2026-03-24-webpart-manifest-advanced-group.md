# Webpart Manifest Advanced Group Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the SPFx webpart manifest so the webpart appears in the correct SharePoint toolbox group, supports full-bleed/full-page hosting, and ships as a new upgradeable package version.

**Architecture:** Keep the change limited to SPFx manifest metadata and package versioning. Add one focused regression test that reads the manifest source and asserts the required host support, full-bleed flag, and standardized preconfigured entry metadata, then bump the package versions and regenerate the review export and `.sppkg`.

**Tech Stack:** SPFx 1.22.2, Heft, Jest via `@rushstack/heft-jest-plugin`, JSONC manifest files, PowerShell

---

### Task 1: Capture the webpart manifest requirements with a failing test

**Files:**
- Create: `src/config/webPartManifest.test.js`
- Test: `src/config/webPartManifest.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
'use strict';

const fs = require('fs');
const path = require('path');

describe('Aures webpart manifest', () => {
  it('uses the Advanced toolbox group and supports full-width/full-page hosts', () => {
    const manifestPath = path.resolve(__dirname, '../../src/webparts/auresApp/AuresAppWebPart.manifest.json');
    const manifestSource = fs.readFileSync(manifestPath, 'utf8');

    expect(manifestSource).toContain('"SharePointFullPage"');
    expect(manifestSource).toContain('"supportsFullBleed": true');
    expect(manifestSource).toContain('"groupId": "5c03119e-3074-46fd-976b-c60198311f70"');
    expect(manifestSource).toContain('"group": { "default": "Advanced" }');
    expect(manifestSource).toContain('"title": { "default": "Elite Mentoring" }');
    expect(manifestSource).toContain('"description": { "default": "Elite Mentoring" }');
    expect(manifestSource).toContain('"description": "Elite Mentoring"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --test-path-pattern webPartManifest.test`
Expected: FAIL because the manifest still uses the old single-host config and legacy toolbox metadata.

- [ ] **Step 3: Write minimal implementation**

Update `src/webparts/auresApp/AuresAppWebPart.manifest.json` from `supportedHosts` to the end of the file so it matches the requested SPFx metadata exactly.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --test-path-pattern webPartManifest.test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/config/webPartManifest.test.js src/webparts/auresApp/AuresAppWebPart.manifest.json
git commit -m "fix: align SPFx webpart manifest metadata"
```

### Task 2: Bump deployable versions for the next SharePoint package

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `config/package-solution.json`

- [ ] **Step 1: Bump project package version**

Update `package.json` and `package-lock.json` from `0.0.2` to the next patch version so the component manifest version advances with `version: "*"` in the SPFx manifest.

- [ ] **Step 2: Bump solution package version**

Update `config/package-solution.json` so `solution.version` and `features[0].version` move from `1.0.1.0` to the next deployable version.

- [ ] **Step 3: Verify version edits**

Run: `Select-String -Path package.json,package-lock.json,config/package-solution.json -Pattern '0.0.3|1.0.2.0'`
Expected: all intended version fields are updated consistently.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json config/package-solution.json
git commit -m "chore: bump package versions for SharePoint redeploy"
```

### Task 3: Rebuild export and deployment package

**Files:**
- Modify: `pro honzu/` via `Create-ProHonzu.ps1`
- Verify: `sharepoint/solution/aures-elite-mentoring.sppkg`
- Verify: `pro honzu/aures-elite-mentoring.sppkg`

- [ ] **Step 1: Regenerate the review export**

Run: `powershell -ExecutionPolicy Bypass -File .\Create-ProHonzu.ps1`
Expected: `pro honzu/` mirrors the updated root project, including the ready-made `.sppkg`.

- [ ] **Step 2: Run focused and full tests**

Run: `npm test -- --test-path-pattern webPartManifest.test`
Run: `npm test`
Expected: PASS

- [ ] **Step 3: Build and package with Heft**

Run: `npm run build`
Run: `npm run package`
Expected: PASS and generate a new `sharepoint/solution/aures-elite-mentoring.sppkg`

- [ ] **Step 4: Verify package outputs**

Confirm the export package in `pro honzu/aures-elite-mentoring.sppkg` exists and matches the built package hash from `sharepoint/solution/aures-elite-mentoring.sppkg`.

- [ ] **Step 5: Commit**

```bash
git add pro\ honzu
git commit -m "build: regenerate review export and SharePoint package"
```

### Task 4: Publish the updated package

**Files:**
- Verify: repository working tree

- [ ] **Step 1: Review final diff**

Run: `git diff --stat HEAD~1 HEAD`
Expected: only manifest, version, test, export, and package-related changes.

- [ ] **Step 2: Push**

Run: `git push origin master`
Expected: remote updated with the new package-ready state.
