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
