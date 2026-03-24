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
