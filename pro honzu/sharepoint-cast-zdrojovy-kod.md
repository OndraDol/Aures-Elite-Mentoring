# SharePoint cast projektu Aures Elite Mentoring

Tento soubor obsahuje kompletni zdrojovy kod SharePoint/SPFx casti projektu k datu exportu.

Prilozeny balicek: `aures-elite-mentoring.sppkg`

## `.yo-rc.json`

```json
{
  "@microsoft/generator-sharepoint": {
    "isCreatingSolution": true,
    "environment": "spo",
    "version": "1.22.2",
    "libraryName": "aures-elite-mentoring",
    "libraryId": "1d89567e-a88d-45ec-a37c-60c5f7ecc886",
    "packageManager": "npm",
    "isDomainIsolated": false,
    "componentType": "webpart"
  }
}

```

## `package.json`

```json
{
  "name": "aures-elite-mentoring",
  "version": "0.0.2",
  "private": true,
  "main": "lib/index.js",
  "engines": {
    "node": ">=22.0.0 <23.0.0"
  },
  "scripts": {
    "build": "gulp bundle",
    "clean": "gulp clean",
    "test": "gulp test"
  },
  "dependencies": {
    "@microsoft/sp-core-library": "1.22.2",
    "@microsoft/sp-lodash-subset": "1.22.2",
    "@microsoft/sp-office-ui-fabric-core": "1.22.2",
    "@microsoft/sp-property-pane": "1.22.2",
    "@microsoft/sp-webpart-base": "1.22.2",
    "@pnp/logging": "^4.18.0",
    "@pnp/sp": "^4.18.0",
    "react": "17.0.1",
    "react-dom": "17.0.1"
  },
  "devDependencies": {
    "@microsoft/rush-stack-compiler-5.3": "0.1.0",
    "@microsoft/sp-build-web": "1.22.2",
    "@microsoft/sp-module-interfaces": "1.22.2",
    "@types/react": "17.0.45",
    "@types/react-dom": "17.0.17",
    "@types/webpack-env": "1.15.2",
    "gulp": "4.0.2",
    "sass": "^1.97.3"
  }
}

```

## `tsconfig.json`

```json
{
  "extends": "./node_modules/@microsoft/rush-stack-compiler-5.3/includes/tsconfig-web.json",
  "compilerOptions": {
    "target": "es5",
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "outDir": "lib",
    "inlineSources": false,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": false,
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@microsoft"
    ],
    "types": [
      "webpack-env"
    ],
    "lib": [
      "es5",
      "dom",
      "es2015.collection",
      "es2015.promise",
      "es2016",
      "es2018"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "lib"
  ]
}

```

## `gulpfile.js`

```js
'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// TSLint not supported in rush-stack-compiler-4.x — disabled
build.lintCmd.enabled = false;

build.initialize(require('gulp'));

```

## `config/config.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json",
  "version": "2.0",
  "bundles": {
    "aures-app-web-part": {
      "components": [
        {
          "entrypoint": "./lib/webparts/auresApp/AuresAppWebPart.js",
          "manifest": "./src/webparts/auresApp/AuresAppWebPart.manifest.json"
        }
      ]
    }
  },
  "externals": {},
  "localizedResources": {
    "AuresAppWebPartStrings": "lib/webparts/auresApp/loc/{locale}.js"
  }
}

```

## `config/copy-assets.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/copy-assets.schema.json",
  "deployCdnPath": "temp/deploy"
}

```

## `config/deploy-azure-storage.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/deploy-azure-storage.schema.json",
  "workingDir": "./temp/deploy/",
  "account": "<!-- STORAGE ACCOUNT NAME -->",
  "container": "aures-elite-mentoring",
  "accessKey": "<!-- ACCESS KEY -->"
}
```

## `config/package-solution.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "aures-elite-mentoring-client-side-solution",
    "id": "1d89567e-a88d-45ec-a37c-60c5f7ecc886",
    "version": "1.0.1.0",
    "includeClientSideAssets": true,
    "isDomainIsolated": false,
    "developer": {
      "name": "",
      "websiteUrl": "",
      "privacyUrl": "",
      "termsOfUseUrl": "",
      "mpnId": ""
    }
  },
  "paths": {
    "zippedPackage": "solution/aures-elite-mentoring.sppkg"
  }
}

```

## `config/serve.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/core-build/serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://localhost:5432/workbench",
  "api": {
    "port": 5432,
    "entryPath": "node_modules/@microsoft/sp-webpart-workbench/lib/api/"
  }
}

```

## `config/write-manifests.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/write-manifests.schema.json",
  "cdnBasePath": "<!-- PATH TO CDN -->"
}
```

## `src/index.ts`

```ts
// A file is required to be in the root of the /src directory by the TypeScript compiler

```

## `src/services/MentoringService.ts`

```ts
import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import {
  IMentor,
  ITalent,
  IMentoringRequest,
  RequestStatus,
  StageDecision
} from './interfaces';

const LIST_MENTORS   = 'Mentors';
const LIST_TALENTS   = 'Talents';
const LIST_REQUESTS  = 'MentoringRequests';

const MENTOR_SELECT  = ['Id', 'Title', 'JobTitle', 'Superpower', 'Bio', 'Capacity', 'AvailabilityNote', 'PhotoUrl', 'IsActive',
                        'MentorUser/Id', 'MentorUser/Title', 'MentorUser/EMail'];
const MENTOR_EXPAND  = ['MentorUser'];

const TALENT_SELECT  = ['Id', 'Title', 'IsActive',
                        'TalentUser/Id', 'TalentUser/Title', 'TalentUser/EMail'];
const TALENT_EXPAND  = ['TalentUser'];

const REQUEST_SELECT = [
  'Id', 'Title', 'CurrentStage', 'RequestStatus',
  'Message1', 'Message2', 'Message3',
  'Stage1Decision', 'Stage2Decision', 'Stage3Decision',
  'Stage1DecisionDate', 'Stage2DecisionDate', 'Stage3DecisionDate',
  'TalentRef/Id', 'TalentRef/Title',
  'Mentor1Ref/Id', 'Mentor1Ref/Title',
  'Mentor2Ref/Id', 'Mentor2Ref/Title',
  'Mentor3Ref/Id', 'Mentor3Ref/Title',
  'Stage1DecisionBy/Id', 'Stage1DecisionBy/Title', 'Stage1DecisionBy/EMail',
  'Stage2DecisionBy/Id', 'Stage2DecisionBy/Title', 'Stage2DecisionBy/EMail',
  'Stage3DecisionBy/Id', 'Stage3DecisionBy/Title', 'Stage3DecisionBy/EMail'
];
const REQUEST_EXPAND = [
  'TalentRef', 'Mentor1Ref', 'Mentor2Ref', 'Mentor3Ref',
  'Stage1DecisionBy', 'Stage2DecisionBy', 'Stage3DecisionBy'
];

export class MentoringService {
  constructor(private readonly _sp: SPFI) {}

  // ----------------------------------------------------------------
  // Mentors
  // ----------------------------------------------------------------

  async getMentors(): Promise<IMentor[]> {
    const items: IMentor[] = await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .select(...MENTOR_SELECT)
      .expand(...MENTOR_EXPAND)
      .filter('IsActive eq 1')();
    return items;
  }

  async getMentorByEmail(email: string): Promise<IMentor | undefined> {
    const items: IMentor[] = await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .select(...MENTOR_SELECT)
      .expand(...MENTOR_EXPAND)
      .filter(`MentorUser/EMail eq '${email}' and IsActive eq 1`)();
    return items[0];
  }

  async getMentorById(mentorId: number): Promise<IMentor> {
    const item: IMentor = await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .getById(mentorId)
      .select(...MENTOR_SELECT)
      .expand(...MENTOR_EXPAND)();
    return item;
  }

  async getAllMentorsForAdmin(): Promise<IMentor[]> {
    const items: IMentor[] = await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .select(...MENTOR_SELECT)
      .expand(...MENTOR_EXPAND)
      .orderBy('Title')();
    return items;
  }

  // ----------------------------------------------------------------
  // Talents
  // ----------------------------------------------------------------

  async getTalentByEmail(email: string): Promise<ITalent | undefined> {
    const items: ITalent[] = await this._sp.web.lists
      .getByTitle(LIST_TALENTS).items
      .select(...TALENT_SELECT)
      .expand(...TALENT_EXPAND)
      .filter(`TalentUser/EMail eq '${email}' and IsActive eq 1`)();
    return items[0];
  }

  async getAllTalents(): Promise<ITalent[]> {
    const items: ITalent[] = await this._sp.web.lists
      .getByTitle(LIST_TALENTS).items
      .select(...TALENT_SELECT)
      .expand(...TALENT_EXPAND)
      .filter('IsActive eq 1')();
    return items;
  }

  async getTalentById(talentId: number): Promise<ITalent> {
    const item: ITalent = await this._sp.web.lists
      .getByTitle(LIST_TALENTS).items
      .getById(talentId)
      .select(...TALENT_SELECT)
      .expand(...TALENT_EXPAND)();
    return item;
  }

  async getAllTalentsForAdmin(): Promise<ITalent[]> {
    const items: ITalent[] = await this._sp.web.lists
      .getByTitle(LIST_TALENTS).items
      .select(...TALENT_SELECT)
      .expand(...TALENT_EXPAND)
      .orderBy('Title')();
    return items;
  }

  // ----------------------------------------------------------------
  // Requests — read
  // ----------------------------------------------------------------

  async getMyRequests(talentId: number): Promise<IMentoringRequest[]> {
    const items: IMentoringRequest[] = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .select(...REQUEST_SELECT)
      .expand(...REQUEST_EXPAND)
      .filter(`TalentRefId eq ${talentId}`)
      .orderBy('Created', false)();
    return items;
  }

  async getPendingRequestsForMentor(mentorId: number): Promise<IMentoringRequest[]> {
    const stageFilter = [
      `(Mentor1RefId eq ${mentorId} and CurrentStage eq 1)`,
      `(Mentor2RefId eq ${mentorId} and CurrentStage eq 2)`,
      `(Mentor3RefId eq ${mentorId} and CurrentStage eq 3)`
    ].join(' or ');

    const items: IMentoringRequest[] = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .select(...REQUEST_SELECT)
      .expand(...REQUEST_EXPAND)
      .filter(`(${stageFilter}) and RequestStatus eq 'Pending'`)
      .orderBy('Created', false)();
    return items;
  }

  async getRequestHistoryForMentor(mentorId: number): Promise<IMentoringRequest[]> {
    const mentorFilter = [
      `Mentor1RefId eq ${mentorId}`,
      `Mentor2RefId eq ${mentorId}`,
      `Mentor3RefId eq ${mentorId}`
    ].join(' or ');

    const items: IMentoringRequest[] = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .select(...REQUEST_SELECT)
      .expand(...REQUEST_EXPAND)
      .filter(`(${mentorFilter}) and RequestStatus ne 'Pending'`)
      .orderBy('Modified', false)();
    return items;
  }

  async getAllRequests(): Promise<IMentoringRequest[]> {
    const items: IMentoringRequest[] = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .select(...REQUEST_SELECT)
      .expand(...REQUEST_EXPAND)
      .orderBy('Created', false)();
    return items;
  }

  async getRequestById(requestId: number): Promise<IMentoringRequest> {
    const item: IMentoringRequest = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .getById(requestId)
      .select(...REQUEST_SELECT)
      .expand(...REQUEST_EXPAND)();
    return item;
  }

  // ----------------------------------------------------------------
  // Requests — write
  // ----------------------------------------------------------------

  async submitRequest(
    talentId: number,
    mentorIds: [number, number?, number?],
    messages: [string, string?, string?]
  ): Promise<number> {
    const body: Record<string, unknown> = {
      Title: 'REQ-2026-TEMP',
      TalentRefId: talentId,
      Mentor1RefId: mentorIds[0],
      Message1: messages[0] ?? '',
      CurrentStage: 1,
      RequestStatus: RequestStatus.Pending
    };

    if (mentorIds[1] != null) {
      body['Mentor2RefId'] = mentorIds[1];
      body['Message2'] = messages[1] ?? '';
    }
    if (mentorIds[2] != null) {
      body['Mentor3RefId'] = mentorIds[2];
      body['Message3'] = messages[2] ?? '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items.add(body);

    const newId: number = result?.Id ?? result?.data?.Id;

    await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .getById(newId)
      .update({ Title: `REQ-2026-${newId}` });

    return newId;
  }

  /**
   * Zaznamenava rozhodnuti mentora a implementuje fall-through logiku:
   * Approve → RequestStatus = Approved
   * Reject  → posun na dalsiho mentora, nebo HR_Review kdyz nikdo nezbyva
   */
  async makeDecision(
    requestId: number,
    stage: 1 | 2 | 3,
    decision: StageDecision,
    decisionById: number
  ): Promise<void> {
    const request = await this.getRequestById(requestId);
    const decisionDate = new Date().toISOString();

    const update: Record<string, unknown> = {
      [`Stage${stage}Decision`]:     decision,
      [`Stage${stage}DecisionDate`]: decisionDate,
      [`Stage${stage}DecisionById`]: decisionById
    };

    if (decision === StageDecision.Approved) {
      update['RequestStatus'] = RequestStatus.Approved;
    } else {
      // Fall-through: posun na dalsiho mentora nebo HR_Review
      if (stage === 1 && request.Mentor2Ref?.Id != null) {
        update['CurrentStage'] = 2;
      } else if ((stage === 1 || stage === 2) && request.Mentor3Ref?.Id != null) {
        update['CurrentStage'] = 3;
      } else {
        update['RequestStatus'] = RequestStatus.HR_Review;
      }
    }

    await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .getById(requestId)
      .update(update);
  }

  // ----------------------------------------------------------------
  // HR / Admin — writes
  // ----------------------------------------------------------------

  async updateMentorCapacity(mentorId: number, capacity: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .getById(mentorId)
      .update({ Capacity: capacity });
  }

  async setMentorActive(mentorId: number, isActive: boolean): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .getById(mentorId)
      .update({ IsActive: isActive });
  }

  async setRequestStatus(requestId: number, status: RequestStatus): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .getById(requestId)
      .update({ RequestStatus: status });
  }

  async setTalentActive(talentId: number, isActive: boolean): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_TALENTS).items
      .getById(talentId)
      .update({ IsActive: isActive });
  }

  async addMentor(data: {
    Title: string;
    MentorUserId: number;
    JobTitle: string;
    Superpower: string;
    Bio: string;
    Capacity: number;
    PhotoUrl: string;
  }): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items.add({
        ...data,
        IsActive: true,
        AvailabilityNote: ''
      });
    return result?.Id ?? result?.data?.Id;
  }

  async updateMentor(mentorId: number, data: Partial<{
    Title: string;
    JobTitle: string;
    Superpower: string;
    Bio: string;
    Capacity: number;
    PhotoUrl: string;
  }>): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .getById(mentorId)
      .update(data);
  }

  async deleteMentor(mentorId: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_MENTORS).items
      .getById(mentorId)
      .delete();
  }

  async deleteRequest(requestId: number): Promise<void> {
    await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .getById(requestId)
      .delete();
  }

  async cancelAllRequestsForTalent(talentId: number): Promise<void> {
    const active = await this._sp.web.lists
      .getByTitle(LIST_REQUESTS).items
      .filter(`TalentRefId eq ${talentId} and (RequestStatus eq 'Pending' or RequestStatus eq 'HR_Review')`)
      .select('Id')();
    for (const item of active) {
      await this._sp.web.lists
        .getByTitle(LIST_REQUESTS).items
        .getById(item.Id)
        .update({ RequestStatus: RequestStatus.Cancelled });
    }
  }
}

```

## `src/services/NotificationService.ts`

```ts
import { IMentor, ITalent } from './interfaces';

type NotificationKind = 'hr-submit' | 'hr-escalation' | 'hr-approval';

interface INotificationPayload {
  kind: NotificationKind;
  to: string[];
  subject: string;
  body: string;
  requestId: number;
  requestTitle: string;
}

/**
 * Notifikace jsou docasne potlacene.
 * Service drzi payload kontrakt, aby slo pozdeji jen doplnit transport pres Power Automate.
 */
export class NotificationService {
  // ----------------------------------------------------------------
  // Verejne metody
  // ----------------------------------------------------------------

  /** Submit: notifikuje HR o nove zadosti */
  async notifyHROnSubmit(
    hrEmail: string,
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    await this._dispatch({
      kind: 'hr-submit',
      to: [hrEmail],
      subject: `Aures Elite Mentoring - Nova zadost o mentoring [${requestTitle}]`,
      body: this._buildHRSubmitBody(talent, mentor, requestId, requestTitle),
      requestId,
      requestTitle
    });
  }

  /** Reject + zadny dalsi mentor: notifikuje HR o eskalaci */
  async notifyHROnEscalation(
    hrEmail: string,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    await this._dispatch({
      kind: 'hr-escalation',
      to: [hrEmail],
      subject: `Aures Elite Mentoring - HR Review vyzadovan [${requestTitle}]`,
      body: this._buildHREscalationBody(talent, requestId, requestTitle),
      requestId,
      requestTitle
    });
  }

  /** Approve: notifikuje HR o schvaleni zadosti */
  async notifyOnApproval(
    hrEmail: string,
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    await this._dispatch({
      kind: 'hr-approval',
      to: [hrEmail],
      subject: `Aures Elite Mentoring - Zadost schvalena [${requestTitle}]`,
      body: this._buildApprovalBody(talent, mentor, requestId, requestTitle),
      requestId,
      requestTitle
    });
  }

  // ----------------------------------------------------------------
  // Soukrome helpery
  // ----------------------------------------------------------------

  private async _dispatch(payload: INotificationPayload): Promise<void> {
    const recipients = payload.to.map(address => address.trim()).filter(Boolean);

    if (recipients.length === 0) {
      console.info('[NotificationService] Notification skipped because no recipient is configured.', {
        kind: payload.kind,
        requestId: payload.requestId,
        requestTitle: payload.requestTitle
      });
      return;
    }

    console.info('[NotificationService] Notification delivery is disabled until Power Automate is implemented.', {
      kind: payload.kind,
      to: recipients,
      subject: payload.subject,
      requestId: payload.requestId,
      requestTitle: payload.requestTitle,
      bodyPreview: payload.body.slice(0, 120)
    });
  }

  private _buildHRSubmitBody(
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): string {
    return `
<p>Dobry den,</p>
<p>
  Talent <strong>${talent.Title}</strong> vytvoril novou zadost o mentoring.
  Jako primarni mentor byl zvolen/a <strong>${mentor.Title}</strong>.
</p>
<p>
  <strong>ID zadosti:</strong> ${requestTitle}<br/>
  <strong>ID zaznamu:</strong> ${requestId}
</p>
<p>
  Prosim, otevrete HR cast aplikace Aures Elite Mentoring a sledujte dalsi prubeh zadosti.
</p>
<p>S pozdravem,<br/>Aures Elite Mentoring System</p>
    `.trim();
  }

  private _buildHREscalationBody(
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): string {
    return `
<p>Dobry den,</p>
<p>
  Zadost talenta <strong>${talent.Title}</strong> (${requestTitle}) byla zamítnuta
  vsemi vybranymi mentory a presla do stavu <strong>HR Review</strong>.
</p>
<p>
  <strong>ID zadosti:</strong> ${requestTitle}<br/>
  <strong>ID zaznamu:</strong> ${requestId}
</p>
<p>
  Prosim, otevrete HR Admin Panel v aplikaci Aures Elite Mentoring
  a dohodnte nasledny postup s talentem.
</p>
<p>S pozdravem,<br/>Aures Elite Mentoring System</p>
    `.trim();
  }

  private _buildApprovalBody(
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): string {
    return `
<p>Dobry den,</p>
<p>
  Zadost talenta <strong>${talent.Title}</strong> byla <strong>schvalena</strong>
  mentorem <strong>${mentor.Title}</strong> (${mentor.JobTitle}).
</p>
<p>
  <strong>ID zadosti:</strong> ${requestTitle}<br/>
  <strong>ID zaznamu:</strong> ${requestId}
</p>
<p>
  Prosim koordinujte nasledne kroky v HR procesu mentoringu.
</p>
<p>S pozdravem,<br/>Aures Elite Mentoring System</p>
    `.trim();
  }
}

```

## `src/services/RoleService.ts`

```ts
import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/site-users/web';

import { ICurrentUser, IMentor, ITalent, UserRole } from './interfaces';
import { MentoringService } from './MentoringService';

/** Nazev SP skupiny, jejiz clenove maji roli HR */
const HR_GROUP_NAME = 'Aures Mentoring HR';

export class RoleService {
  private readonly _mentoring: MentoringService;

  constructor(private readonly _sp: SPFI) {
    this._mentoring = new MentoringService(_sp);
  }

  /**
   * Zjisti aktualne prihlaseneho uzivatele a jeho role.
   * Role se detekuji paralelne — uzivatel muze mit vice roli zaroven (napr. Talent + Mentor).
   */
  async getCurrentUser(): Promise<ICurrentUser> {
    const spUser = await this._sp.web.currentUser();

    const [mentorRecord, talentRecord, isHR] = await Promise.all([
      this._mentoring.getMentorByEmail(spUser.Email),
      this._mentoring.getTalentByEmail(spUser.Email),
      this._checkHRMembership(spUser.Id)
    ]);

    const roles = this._resolveRoles(mentorRecord, talentRecord, isHR);

    return {
      id: spUser.Id,
      title: spUser.Title,
      email: spUser.Email,
      roles,
      mentorRecord,
      talentRecord
    };
  }

  // ----------------------------------------------------------------
  // Soukrome helpery
  // ----------------------------------------------------------------

  private _resolveRoles(
    mentor: IMentor | undefined,
    talent: ITalent | undefined,
    isHR: boolean
  ): UserRole[] {
    const roles: UserRole[] = [];
    if (mentor) roles.push(UserRole.Mentor);
    if (talent) roles.push(UserRole.Talent);
    if (isHR)   roles.push(UserRole.HR);
    if (roles.length === 0) roles.push(UserRole.Unknown);
    return roles;
  }

  /**
   * Zkontroluje, zda uzivatel patri do SP skupiny HR_GROUP_NAME.
   * Pokud skupina neexistuje nebo nastane jina chyba, vraci false (fail-safe).
   */
  private async _checkHRMembership(userId: number): Promise<boolean> {
    try {
      const groups: { Title: string }[] = await this._sp.web.siteUsers
        .getById(userId)
        .groups();
      return groups.some(g => g.Title === HR_GROUP_NAME);
    } catch {
      return false;
    }
  }
}

```

## `src/services/interfaces.ts`

```ts
// ============================================================
// Enums
// ============================================================

export enum RequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  HR_Review = 'HR_Review',
  Scheduled = 'Scheduled',
  Cancelled = 'Cancelled'
}

export enum StageDecision {
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum UserRole {
  Talent = 'Talent',
  Mentor = 'Mentor',
  HR = 'HR',
  Unknown = 'Unknown'
}

// ============================================================
// SharePoint field helpers
// ============================================================

export interface ISPUser {
  Id: number;
  Title: string;
  EMail: string;
}

export interface ISPLookup {
  Id: number;
  Title: string;
}

// ============================================================
// Domain interfaces
// ============================================================

export interface IMentor {
  Id: number;
  Title: string;
  MentorUser: ISPUser;
  JobTitle: string;
  Superpower: string;
  Bio: string;
  Capacity: number;
  AvailabilityNote: string;
  PhotoUrl: string;
  IsActive: boolean;
}

export interface ITalent {
  Id: number;
  Title: string;
  TalentUser: ISPUser;
  IsActive: boolean;
}

export interface IMentoringRequest {
  Id: number;
  Title: string;
  TalentRef: ISPLookup;
  Mentor1Ref?: ISPLookup;
  Mentor2Ref?: ISPLookup;
  Mentor3Ref?: ISPLookup;
  Message1?: string;
  Message2?: string;
  Message3?: string;
  CurrentStage: 1 | 2 | 3;
  RequestStatus: RequestStatus;
  Stage1Decision?: StageDecision;
  Stage2Decision?: StageDecision;
  Stage3Decision?: StageDecision;
  Stage1DecisionDate?: string;
  Stage2DecisionDate?: string;
  Stage3DecisionDate?: string;
  Stage1DecisionBy?: ISPUser;
  Stage2DecisionBy?: ISPUser;
  Stage3DecisionBy?: ISPUser;
}

// ============================================================
// App-level types
// ============================================================

export interface ICurrentUser {
  id: number;
  title: string;
  email: string;
  roles: UserRole[];
  mentorRecord?: IMentor;
  talentRecord?: ITalent;
}

```

## `src/utils/mockData.ts`

```ts
/**
 * Mock data pro lokalni vyvoj (gulp serve bez SP Online pripojeni).
 * Pouzivano jako fallback kdyz SharePoint neni dostupny.
 */

import {
  IMentor,
  ITalent,
  IMentoringRequest,
  RequestStatus,
  StageDecision
} from '../services/interfaces';

export const MOCK_MENTORS: IMentor[] = [
  {
    Id: 1,
    Title: 'Karolína Topolová',
    MentorUser: { Id: 101, Title: 'Karolína Topolová', EMail: 'karolina.topolova@aures.cz' },
    JobTitle: 'co-CEO',
    Superpower: 'Networking, change management, schopnost ovlivňovat a propojovat lidi',
    Bio: 'Karolína Topolová začala svou kariéru v roce 1998 založením firemního call centra, které tehdy tvořilo pět lidí a postupně vyrostlo v profesionální tým s více než 200 zaměstnanci. Během své kariéry prošla řadou manažerských rolí napříč oblastmi sales, financování, HR i externí komunikace. Díky této zkušenosti získala komplexní pohled na fungování firmy a její růst. V roce 2012 se stala Generální ředitelkou společnosti, a o tři roky později také Předsedkyní představenstva.\n\nNejvětší překonaná výzva: Úspěšně provést firmu zásadní transformací v období ekonomické krize a pandemie COVID-19.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 2,
    Title: 'Petr Vaněček',
    MentorUser: { Id: 102, Title: 'Petr Vaněček', EMail: 'petr.vanecek@aures.cz' },
    JobTitle: 'co-CEO',
    Superpower: 'Schopnost proměňovat data a technologické inovace v konkrétní businessová řešení a růst firmy',
    Bio: 'Petr Vaněček ve společnosti působí více než dvě dekády a během této doby prošel řadou klíčových manažerských rolí napříč businessem. Díky hluboké znalosti fungování firmy i trhu se dlouhodobě podílí na jejím strategickém směřování a rozvoji. V roli Co-CEO se soustředí zejména na rozvoj businessu, digitalizaci, práci s daty a technologické inovace.\n\nNejvětší překonaná výzva: Krizový management za Covidu.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 3,
    Title: 'Luboš Vorlík',
    MentorUser: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' },
    JobTitle: 'Managing Director CZ/SK',
    Superpower: 'Motivace a vedení týmu, orientace na výsledek, prezentační a komunikační dovednosti',
    Bio: 'Luboš Vorlík ve společnosti působí jako Výkonný ředitel pro Českou republiku a Slovensko, kde zodpovídá za strategické řízení a další rozvoj společnosti na obou trzích. Do firmy nastoupil v roce 2003 a během svého působení prošel řadou zákaznicky orientovaných pozic, což mu poskytlo hluboké porozumění potřebám klientů i fungování obchodních procesů.\n\nNejvětší překonaná výzva: Transformace sales departmentu na SK.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 4,
    Title: 'Martin Hrudník',
    MentorUser: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' },
    JobTitle: 'COO',
    Superpower: 'Schopnost přetavit detailní znalost operativy v efektivní strategii nákupu a růstu',
    Bio: 'Martin Hrudník působí ve společnosti jako COO a je zodpovědný za nákupní strategii společnosti, související marketingové aktivity a projekty podporující další expanzi skupiny. Do firmy nastoupil již v roce 1999 a během své kariéry prošel řadou pozic v oblasti nákupu a provozu.\n\nNejvětší překonaná výzva: Po 15 letech ve výkupní „bublině" převzetí odpovědnosti i za prodejní výsledky.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 5,
    Title: 'Daniel Luňáček',
    MentorUser: { Id: 105, Title: 'Daniel Luňáček', EMail: 'daniel.lunacek@aures.cz' },
    JobTitle: 'Group Sales Director',
    Superpower: 'Jak dosáhnout výsledku pomocí analýzy, lidí kolem sebe a správně nastavených procesů',
    Bio: 'Daniel Luňáček působí ve firmě 25 let. Svou kariéru začal jako representant v call centru a postupně se vypracoval přes pozici manažera poboček až na Regional Managera pro Českou republiku a Slovensko. Následně působil jako Country Manager pro CZ a SK a v současnosti zastává pozici Group Sales Director.\n\nNejvětší překonaná výzva: Naučit se delegovat, nevěřit jen v sám sebe, ale v tým.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 6,
    Title: 'Zdeněk Batěk',
    MentorUser: { Id: 106, Title: 'Zdeněk Batěk', EMail: 'zdenek.batek@aures.cz' },
    JobTitle: 'Group Purchasing Director',
    Superpower: 'Strategické myšlení a převedení vizí do reálné produkce',
    Bio: 'Zdeněk Batěk do AAA nastoupil v roce 2007 hned po střední škole na pozici testovacího technika. Po 3 letech se vrátil do Prahy a začal vykupovat auta jako mobilní výkupčí. V roce 2012 se posunul na pozici manažera mobilního výkupu. Byl vlastníkem nového projektu Buying Guide/Pricing Guide a nyní zastává pozici Group Purchasing Director.\n\nNejvětší překonaná výzva: Rychlý přechod do manažerské pozice v mladém věku s řízením pozičně i věkově starších kolegů.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 7,
    Title: 'Miroslav Vápeník',
    MentorUser: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
    JobTitle: 'Managing Director PL',
    Superpower: 'Schopnost budovat výkonné obchodní týmy a rozvíjet jejich potenciál',
    Bio: 'Miroslav Vápeník působí ve společnosti dvacátým rokem. Ve firmě si prošel všechny prodejní pozice od Sales Closing Managera až po Country Managera CZ. Aktuálně působí jako Managing Director pro polský trh, kde se podílí na strategickém růstu a budování silné zákaznické zkušenosti.\n\nNejvětší překonaná výzva: Převzetí odpovědnosti za řízení a rozvoj trhu v Polsku — prostředí s jinou zákaznickou mentalitou a silnou konkurencí.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 8,
    Title: 'Alen Svoboda',
    MentorUser: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
    JobTitle: 'General Manager Prague',
    Superpower: 'Na základě analýzy a empatické komunikace dokáže okolí vysvětlit, kam společně chceme dojít',
    Bio: 'Alen Svoboda působí ve firmě celkem 15 let a momentálně řídí pražský region. Svou kariéru začal jako prodejce na pobočce v Brně, kde velmi rychle postoupil na manažerské pozice. Nabral obrovské zkušenosti s chápáním prodeje jako vztahové záležitosti a souboru všech detailů ovlivňujících výkonnost business modelu.\n\nNejvětší překonaná výzva: Změnit pohled na strategii spolupracovníků a vysvětlovat hlubší motivanty ovlivňující pozitivní náhled v rámci fungování ve firmě.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 9,
    Title: 'Zuzana Voborníková',
    MentorUser: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' },
    JobTitle: 'Group Staffing Manager',
    Superpower: 'Schopnost pozitivně motivovat a propojovat lidi napříč týmy i zeměmi',
    Bio: 'Zuzana Voborníková působí na pozici Group Staffing Manager a vede náborové aktivity napříč skupinou ve všech zemích. Má více než dvacet let zkušeností v oblasti HR a recruitmentu v mezinárodních společnostech. V minulosti působila jako Senior Recruiter v Amazonu nebo ve vedoucích recruitment rolích ve firmách CSC či AB InBev.\n\nNejvětší překonaná výzva: Skloubení návratu na manažerskou roli s malým dítětem po MD. Otevření a personální obsazení poboček v Německu.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  },
  {
    Id: 10,
    Title: 'Marie Voršilková',
    MentorUser: { Id: 110, Title: 'Marie Voršilková', EMail: 'marie.vorsilkova@aures.cz' },
    JobTitle: 'Chief HR Officer',
    Superpower: 'Leadership, motivace lidí, práce se změnou',
    Bio: 'Marie Voršilková pochází z bankovního prostředí, kde prošla prodejními i rozvojovými rolemi v retailovém, korporátním i premium bankovnictví. Postupně ji její cesta přivedla od obchodu přes rozvoj lidí až ke komplexní HR agendě. Po přechodu do automotive prošla dynamickým obdobím změn — od integrace a slučování entit přes uzavírání zahraničních poboček až po optimalizace a restrukturalizace.\n\nNejvětší překonaná výzva: Udržet motivaci a energii pracovních týmů v obdobích velkých změn a ekonomických krizí.',
    Capacity: 2,
    AvailabilityNote: '',
    PhotoUrl: '',
    IsActive: true
  }
];

export const MOCK_TALENTS: ITalent[] = [
  { Id: 32069, Title: 'Marek Blahák', TalentUser: { Id: 32069, Title: 'Marek Blahák', EMail: 'marek.blahak@aures.cz' }, IsActive: true },
  { Id: 111056, Title: 'Michal Gabrhel', TalentUser: { Id: 111056, Title: 'Michal Gabrhel', EMail: 'michal.gabrhel@aures.cz' }, IsActive: true },
  { Id: 25400, Title: 'Adam Gruber', TalentUser: { Id: 25400, Title: 'Adam Gruber', EMail: 'adam.gruber@aures.cz' }, IsActive: true },
  { Id: 14233, Title: 'Martin Janovský', TalentUser: { Id: 14233, Title: 'Martin Janovský', EMail: 'martin.janovsky@aures.cz' }, IsActive: true },
  { Id: 28179, Title: 'Jiří Kamír', TalentUser: { Id: 28179, Title: 'Jiří Kamír', EMail: 'jiri.kamir@aures.cz' }, IsActive: true },
  { Id: 13835, Title: 'Tomáš Kaprálek', TalentUser: { Id: 13835, Title: 'Tomáš Kaprálek', EMail: 'tomas.kapralek@aures.cz' }, IsActive: true },
  { Id: 1509, Title: 'Jan Kryl', TalentUser: { Id: 1509, Title: 'Jan Kryl', EMail: 'jan.kryl@aures.cz' }, IsActive: true },
  { Id: 4620, Title: 'Petr Kuchynka', TalentUser: { Id: 4620, Title: 'Petr Kuchynka', EMail: 'petr.kuchynka@aures.cz' }, IsActive: true },
  { Id: 12381, Title: 'Jakub Matuška', TalentUser: { Id: 12381, Title: 'Jakub Matuška', EMail: 'jakub.matuska@aures.cz' }, IsActive: true },
  { Id: 11887, Title: 'Stanislav Otčenášek', TalentUser: { Id: 11887, Title: 'Stanislav Otčenášek', EMail: 'stanislav.otcenasek@aures.cz' }, IsActive: true },
  { Id: 110249, Title: 'Miroslav Pařík', TalentUser: { Id: 110249, Title: 'Miroslav Pařík', EMail: 'miroslav.parik@aures.cz' }, IsActive: true },
  { Id: 23574, Title: 'Tomáš Preus', TalentUser: { Id: 23574, Title: 'Tomáš Preus', EMail: 'tomas.preus@aures.cz' }, IsActive: true },
  { Id: 7042, Title: 'Dušan Procházka', TalentUser: { Id: 7042, Title: 'Dušan Procházka', EMail: 'dusan.prochazka@aures.cz' }, IsActive: true },
  { Id: 27487, Title: 'David Reich', TalentUser: { Id: 27487, Title: 'David Reich', EMail: 'david.reich@aures.cz' }, IsActive: true },
  { Id: 8128, Title: 'Marcel Ronge', TalentUser: { Id: 8128, Title: 'Marcel Ronge', EMail: 'marcel.ronge@aures.cz' }, IsActive: true },
  { Id: 27599, Title: 'Jakub Strouhal', TalentUser: { Id: 27599, Title: 'Jakub Strouhal', EMail: 'jakub.strouhal@aures.cz' }, IsActive: true },
  { Id: 32407, Title: 'Daniel Svoboda', TalentUser: { Id: 32407, Title: 'Daniel Svoboda', EMail: 'daniel.svoboda@aures.cz' }, IsActive: true },
  { Id: 27539, Title: 'Petr Šanda', TalentUser: { Id: 27539, Title: 'Petr Šanda', EMail: 'petr.sanda@aures.cz' }, IsActive: true },
  { Id: 30798, Title: 'Robert Šmol', TalentUser: { Id: 30798, Title: 'Robert Šmol', EMail: 'robert.smol@aures.cz' }, IsActive: true },
  { Id: 15643, Title: 'Petr Šulc', TalentUser: { Id: 15643, Title: 'Petr Šulc', EMail: 'petr.sulc@aures.cz' }, IsActive: true },
  { Id: 70142, Title: 'Jarosław Skiba', TalentUser: { Id: 70142, Title: 'Jarosław Skiba', EMail: 'jaroslaw.skiba@aures.cz' }, IsActive: true },
];

export const MOCK_REQUESTS: IMentoringRequest[] = [
  {
    Id: 1,
    Title: 'REQ-2026-1',
    TalentRef: { Id: 27487, Title: 'David Reich' },
    Mentor1Ref: { Id: 1, Title: 'Karolína Topolová' },
    Mentor2Ref: { Id: 2, Title: 'Petr Vaněček' },
    Mentor3Ref: { Id: 10, Title: 'Marie Voršilková' },
    Message1: 'Chtěl bych se naučit, jak prezentovat strategické projekty top managementu a budovat kariéru v mezinárodní firmě.',
    Message2: 'Zajímám se o digitalizaci a inovace v businessu.',
    Message3: 'Ráda bych pochopila HR perspektivu při řízení změn.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Pending
  },
  {
    Id: 2,
    Title: 'REQ-2026-2',
    TalentRef: { Id: 27487, Title: 'David Reich' },
    Mentor1Ref: { Id: 4, Title: 'Martin Hrudník' },
    Mentor2Ref: { Id: 5, Title: 'Daniel Luňáček' },
    Message1: 'Zajímám se o operativní řízení a efektivitu procesů.',
    Message2: 'Obchodní dovednosti jsou klíč k mému kariérnímu rozvoji.',
    CurrentStage: 2,
    RequestStatus: RequestStatus.Pending,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-02-15T10:30:00Z',
    Stage1DecisionBy: { Id: 104, Title: 'Martin Hrudník', EMail: 'martin.hrudnik@aures.cz' }
  },
  {
    Id: 3,
    Title: 'REQ-2026-3',
    TalentRef: { Id: 32069, Title: 'Marek Blahák' },
    Mentor1Ref: { Id: 9, Title: 'Zuzana Voborníková' },
    Message1: 'Chtěla bych lépe porozumět náborovým procesům a budování týmů v mezinárodním prostředí.',
    CurrentStage: 1,
    RequestStatus: RequestStatus.Approved,
    Stage1Decision: StageDecision.Approved,
    Stage1DecisionDate: '2026-02-20T14:00:00Z',
    Stage1DecisionBy: { Id: 109, Title: 'Zuzana Voborníková', EMail: 'zuzana.vobornikova@aures.cz' }
  },
  {
    Id: 4,
    Title: 'REQ-2026-4',
    TalentRef: { Id: 12381, Title: 'Jakub Matuška' },
    Mentor1Ref: { Id: 7, Title: 'Miroslav Vápeník' },
    Mentor2Ref: { Id: 8, Title: 'Alen Svoboda' },
    Mentor3Ref: { Id: 3, Title: 'Luboš Vorlík' },
    Message1: 'Zajímám se o obchodní strategii na zahraničních trzích.',
    Message2: 'Prodej jako vztahová záležitost je téma, které mě zajímá.',
    Message3: 'Strategické řízení a rozvoj na trhu CZ/SK je to, co hledám.',
    CurrentStage: 3,
    RequestStatus: RequestStatus.HR_Review,
    Stage1Decision: StageDecision.Rejected,
    Stage1DecisionDate: '2026-01-10T09:00:00Z',
    Stage1DecisionBy: { Id: 107, Title: 'Miroslav Vápeník', EMail: 'miroslav.vapenik@aures.cz' },
    Stage2Decision: StageDecision.Rejected,
    Stage2DecisionDate: '2026-01-15T11:00:00Z',
    Stage2DecisionBy: { Id: 108, Title: 'Alen Svoboda', EMail: 'alen.svoboda@aures.cz' },
    Stage3Decision: StageDecision.Rejected,
    Stage3DecisionDate: '2026-01-20T13:00:00Z',
    Stage3DecisionBy: { Id: 103, Title: 'Luboš Vorlík', EMail: 'lubos.vorlik@aures.cz' }
  }
];

```

## `src/webparts/auresApp/AuresAppWebPart.manifest.json`

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "710fcc7f-4d14-424c-947b-74a2c48623d0",
  "alias": "AuresAppWebPart",
  "componentType": "WebPart",

  // The "*" signifies that the version should be taken from the package.json
  "version": "*",
  "manifestVersion": 2,

  // If true, the component can only be installed on sites where Custom Script is allowed.
  // Components that allow authors to embed arbitrary script code should set this to true.
  // https://support.office.com/en-us/article/Turn-scripting-capabilities-on-or-off-1f2c515f-5d7e-448a-9fd7-835da935584f
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart"],

  "preconfiguredEntries": [{
    "groupId": "5c03119e-3074-46fd-976b-c60198311f70", // Other
    "group": { "default": "Other" },
    "title": { "default": "AuresAPP" },
    "description": { "default": "AuresAPP description" },
    "officeFabricIconFontName": "Page",
    "properties": {
      "description": "AuresAPP"
    }
  }]
}

```

## `src/webparts/auresApp/AuresAppWebPart.ts`

```ts
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { spfi, SPFI } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';

import * as strings from 'AuresAppWebPartStrings';
import AuresApp from './components/AuresApp';
import { IAuresAppProps } from './components/IAuresAppProps';

export interface IAuresAppWebPartProps {
  description: string;
  hrEmail: string;
}

export default class AuresAppWebPart extends BaseClientSideWebPart<IAuresAppWebPartProps> {
  private _sp: SPFI;

  protected async onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context));
  }

  public render(): void {
    const element: React.ReactElement<IAuresAppProps> = React.createElement(
      AuresApp,
      {
        sp: this._sp,
        context: this.context,
        hrEmail: this.properties.hrEmail ?? ''
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('hrEmail', {
                  label: 'HR Admin Group Email (prijemce notifikaci)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

```

## `src/webparts/auresApp/components/AccessDenied.tsx`

```tsx
import * as React from 'react';
import styles from './AuresApp.module.scss';

const AccessDenied: React.FC = () => (
  <div className={styles.accessDenied}>
    <div className={styles.accessDeniedIcon}>🔒</div>
    <h2>Přístup odepřen</h2>
    <p>
      Váš účet není registrován jako Talent ani Mentor
      v systému Aures Elite Mentoring.
    </p>
    <p>
      Kontaktujte HR oddělení Aures Holdings pro přidání do systému.
    </p>
  </div>
);

export default AccessDenied;

```

## `src/webparts/auresApp/components/AppShell.tsx`

```tsx
import * as React from 'react';
import styles from './AuresApp.module.scss';
import { ICurrentUser, UserRole } from '../../../services/interfaces';
import { AppView, NavigateFn } from './AppView';

interface ITab { label: string; view: AppView; }

const TALENT_TABS_BASE: ITab[] = [
  { label: 'Katalog mentorů', view: 'MentorCatalog' },
];
const TALENT_TABS_WITH_REQUESTS: ITab[] = [
  { label: 'Katalog mentorů', view: 'MentorCatalog' },
  { label: 'Moje žádosti',    view: 'MyRequests'    },
  { label: 'Změna volby',     view: 'ResetChoice'   },
];

const MENTOR_TABS: ITab[] = [
  { label: 'Čekající žádosti', view: 'PendingRequests' },
  { label: 'Historie',         view: 'RequestHistory'  },
];

const HR_TABS: ITab[] = [
  { label: 'Mentees dashboard',  view: 'MenteesDashboard'   },
  { label: 'Domluvené mentoringy', view: 'ApprovedMentorings' },
  { label: 'Mentoři',             view: 'MentorManagement'   },
  { label: 'Správa talentů',      view: 'TalentManagement'   },
  { label: 'Kapacita',            view: 'CapacityDashboard'  },
];

const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  [UserRole.Talent]: 'Talent',
  [UserRole.Mentor]: 'Mentor',
  [UserRole.HR]:     'HR Admin',
};

const NAVIGABLE_ROLES: UserRole[] = [UserRole.Talent, UserRole.Mentor, UserRole.HR];

interface IAppShellProps {
  currentUser: ICurrentUser;
  currentView: AppView;
  navigate: NavigateFn;
  children: React.ReactNode;
  navBadges?: Partial<Record<AppView, number>>;
  hasActiveRequests?: boolean;
}

const AppShell: React.FC<IAppShellProps> = ({
  currentUser, currentView, navigate, children, navBadges, hasActiveRequests
}) => {
  const navigableRoles = currentUser.roles.filter(r => NAVIGABLE_ROLES.includes(r));
  const [activeRole, setActiveRole] = React.useState<UserRole>(navigableRoles[0]);

  const getTabsForRole = (role: UserRole): ITab[] => {
    if (role === UserRole.Talent) {
      return hasActiveRequests ? TALENT_TABS_WITH_REQUESTS : TALENT_TABS_BASE;
    }
    if (role === UserRole.Mentor) return MENTOR_TABS;
    if (role === UserRole.HR) return HR_TABS;
    return [];
  };

  const tabs = getTabsForRole(activeRole);

  const handleRoleSwitch = (role: UserRole): void => {
    setActiveRole(role);
    const defaultTab = getTabsForRole(role)[0];
    if (defaultTab) navigate(defaultTab.view);
  };

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLogo}>AURES</div>
          <span className={styles.headerTitle}>
            <span className={styles.headerTitleAccent}>ELITE</span>
            {' MENTORING'}
          </span>
        </div>
        <span className={styles.headerUser}>{currentUser.title}</span>
      </header>

      {navigableRoles.length > 1 && (
        <div className={styles.roleSwitch}>
          {navigableRoles.map(role => (
            <button
              key={role}
              className={role === activeRole ? styles.roleBtnActive : styles.roleBtn}
              onClick={() => handleRoleSwitch(role)}
            >
              {ROLE_LABELS[role] ?? role}
            </button>
          ))}
        </div>
      )}

      <nav className={styles.nav}>
        {tabs.map(tab => {
          const badge = navBadges?.[tab.view] ?? 0;
          return (
            <button
              key={tab.view}
              className={currentView === tab.view ? styles.navTabActive : styles.navTab}
              onClick={() => navigate(tab.view)}
            >
              {tab.label}
              {badge > 0 && <span className={styles.navBadge}>{badge}</span>}
            </button>
          );
        })}
      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default AppShell;

```

## `src/webparts/auresApp/components/AppView.ts`

```ts
// Vsechny mozne pohledy aplikace — pouzivano state-based routerem v AuresApp

export type AppView =
  // Talent
  | 'MentorCatalog'
  | 'RequestForm'
  | 'MyRequests'
  | 'ResetChoice'
  // Mentor
  | 'PendingRequests'
  | 'RequestDetail'
  | 'RequestHistory'
  // HR
  | 'MenteesDashboard'
  | 'ApprovedMentorings'
  | 'MentorManagement'
  | 'TalentManagement'
  | 'CapacityDashboard'
  // System
  | 'AccessDenied';

/** Navigacni funkce predavana do child komponent */
export type NavigateFn = (view: AppView, params?: Record<string, unknown>) => void;

/** Props rozsirujici child komponenty o moznost navigace */
export interface INavigationProps {
  navigate: NavigateFn;
}

```

## `src/webparts/auresApp/components/AuresApp.module.scss`

```scss
// ============================================================
// Aures Elite Mentoring — Premium Design System v8
// "Concierge VIP" aesthetic: Navy + Gold + Glassmorphism
// ============================================================

// ----------------------------------------------------------------
// Design Tokens
// ----------------------------------------------------------------

// Brand — Navy
$navy:          #0A2647;
$navy-mid:      #0F3460;
$navy-lt:       #1B4D8E;

// Brand — Interactive Blue
$primary:       #1B6AE0;
$primary-dk:    #1558B8;
$primary-lt:    rgba(27, 106, 224, 0.06);
$primary-ring:  rgba(27, 106, 224, 0.14);

// Brand — Elite Gold
$gold:          #C9A84C;
$gold-lt:       #DAC06E;
$gold-dk:       #A88B3A;
$gold-glow:     rgba(201, 168, 76, 0.18);
$gold-subtle:   rgba(201, 168, 76, 0.08);

// Semantic
$success:       #0D9F3F;
$success-lt:    #E6F9ED;
$warning:       #B8860B;
$warning-lt:    #FFF8E7;
$error:         #C53030;
$error-lt:      #FEE5E5;
$info:          #1B6AE0;
$info-lt:       #EBF3FE;

// Surface & Layout
$bg:            #F5F6F8;
$bg-subtle:     #ECEEF2;
$surface:       #FFFFFF;
$surface-glass: rgba(255, 255, 255, 0.72);
$border:        #E2E5EB;
$border-lt:     #ECEEF2;

// Text
$text:          #1A1D23;
$text-secondary:#4A5060;
$text-muted:    #7C8290;

// Shadows (blue-tinted for premium feel)
$shadow-xs:     0 1px 2px rgba(10, 38, 71, 0.04);
$shadow-sm:     0 1px 4px rgba(10, 38, 71, 0.06), 0 1px 2px rgba(10, 38, 71, 0.04);
$shadow-md:     0 4px 16px rgba(10, 38, 71, 0.08), 0 1px 4px rgba(10, 38, 71, 0.04);
$shadow-lg:     0 8px 32px rgba(10, 38, 71, 0.10), 0 2px 8px rgba(10, 38, 71, 0.05);
$shadow-xl:     0 16px 48px rgba(10, 38, 71, 0.14), 0 4px 16px rgba(10, 38, 71, 0.06);
$shadow-gold:   0 4px 20px rgba(201, 168, 76, 0.20);
$shadow-header: 0 4px 24px rgba(10, 38, 71, 0.25);

// Radii
$radius-xs:   4px;
$radius-sm:   6px;
$radius-md:   10px;
$radius-lg:   14px;
$radius-xl:   18px;
$radius-pill: 100px;

// Transitions
$ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
$ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1);
$transition:    0.2s $ease-smooth;
$transition-card: 0.28s $ease-out;
$transition-slow: 0.4s $ease-out;

// ----------------------------------------------------------------
// Keyframes
// ----------------------------------------------------------------

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes pulseGold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.25); }
  50%      { box-shadow: 0 0 0 6px rgba(201, 168, 76, 0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

// ----------------------------------------------------------------
// Root
// ----------------------------------------------------------------

.auresApp {
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 14px;
  color: $text;
  background: $bg;
  min-height: 100%;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// ----------------------------------------------------------------
// App Shell
// ----------------------------------------------------------------

.appShell {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

// ----------------------------------------------------------------
// Header — Premium Navy + Gold Stripe
// ----------------------------------------------------------------

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  background: linear-gradient(135deg, $navy 0%, $navy-mid 50%, $navy-lt 100%);
  box-shadow: $shadow-header;
  flex-shrink: 0;
  position: relative;
  z-index: 10;

  // Gold accent stripe at bottom
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $gold-dk 15%,
      $gold 40%,
      $gold-lt 60%,
      $gold-dk 85%,
      transparent 100%
    );
  }
}

.headerLeft {
  display: flex;
  align-items: center;
  gap: 14px;
}

// Logo placeholder — AURES wordmark
.headerLogo {
  padding: 0 16px;
  min-width: 90px;
  height: 48px;
  border-radius: 6px;
  background: linear-gradient(135deg, $gold-dk, $gold, $gold-lt);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.30);
  
  color: $navy;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 900;
  font-size: 21px;
  letter-spacing: 0px;
}

.headerTitle {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.90);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.headerTitleAccent {
  color: $gold;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.headerUser {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.80);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: $radius-pill;
  border: 1px solid rgba(255, 255, 255, 0.10);
  letter-spacing: 0.2px;
  transition: all $transition;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(201, 168, 76, 0.30);
  }
}

// ----------------------------------------------------------------
// Role Switcher — Frosted glass strip
// ----------------------------------------------------------------

.roleSwitch {
  display: flex;
  gap: 6px;
  padding: 8px 28px;
  background: linear-gradient(180deg, darken($navy, 3%) 0%, $navy 100%);
  border-bottom: 1px solid rgba(201, 168, 76, 0.12);
}

.roleBtn,
.roleBtnActive {
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.65);
  transition: all $transition;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
    color: rgba(255, 255, 255, 0.90);
    border-color: rgba(255, 255, 255, 0.25);
  }
}

.roleBtnActive {
  background: rgba(201, 168, 76, 0.15);
  color: $gold-lt;
  font-weight: 700;
  border-color: rgba(201, 168, 76, 0.40);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.10);
}

// ----------------------------------------------------------------
// Nav tabs — Elevated with gold active indicator
// ----------------------------------------------------------------

.nav {
  display: flex;
  border-bottom: 1px solid $border;
  background: $surface;
  padding: 0 28px;
  box-shadow: $shadow-xs;
  flex-shrink: 0;
  gap: 2px;
}

.navTab,
.navTabActive {
  display: inline-flex;
  align-items: center;
  padding: 14px 20px;
  border: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  background: transparent;
  font-size: 13.5px;
  font-family: inherit;
  color: $text-muted;
  cursor: pointer;
  white-space: nowrap;
  transition: color $transition, border-color $transition, background $transition;
  letter-spacing: 0.2px;
  position: relative;

  &:hover {
    color: $text-secondary;
    background: rgba(27, 106, 224, 0.03);
  }
}

.navTabActive {
  color: $navy;
  border-bottom-color: $gold;
  font-weight: 700;
  letter-spacing: 0.1px;
}

.navBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: $radius-pill;
  background: $error;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  margin-left: 8px;
  line-height: 1;
  animation: fadeUp 0.3s $ease-out;
  box-shadow: 0 2px 6px rgba(197, 48, 48, 0.30);
}

// ----------------------------------------------------------------
// Main content — generous padding
// ----------------------------------------------------------------

.content {
  flex: 1;
  padding: 32px 28px;
  animation: fadeIn 0.25s ease;
}

// ----------------------------------------------------------------
// AccessDenied — Premium empty state
// ----------------------------------------------------------------

.accessDenied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 32px;
  text-align: center;

  h2 {
    margin: 20px 0 10px;
    font-size: 24px;
    font-weight: 700;
    color: $text;
    letter-spacing: -0.3px;
  }

  p {
    margin: 4px 0;
    color: $text-muted;
    max-width: 400px;
    line-height: 1.7;
    font-size: 15px;
  }
}

.accessDeniedIcon {
  font-size: 64px;
  line-height: 1;
  opacity: 0.8;
}

// ================================================================
// Shared Utilities
// ================================================================

.pageTitle {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px;
  color: $text;
  letter-spacing: -0.3px;
  position: relative;
  padding-left: 14px;

  // Gold accent bar
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 3px;
    border-radius: 3px;
    background: linear-gradient(180deg, $gold, $gold-dk);
  }
}

.pageHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .pageTitle { margin: 0; }
}

// Loading — premium spinner
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  gap: 18px;
  color: $text-muted;
  font-size: 14px;
  letter-spacing: 0.2px;

  &::before {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    border: 3px solid $border-lt;
    border-top-color: $gold;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  color: $text-muted;

  p {
    margin: 8px 0;
    font-size: 15px;
    max-width: 380px;
    line-height: 1.7;
  }
}

.sectionHint {
  font-size: 13px;
  color: $text-muted;
  margin: -14px 0 20px;
  line-height: 1.55;
  padding-left: 14px;
}

// ----------------------------------------------------------------
// Buttons — Refined with premium feel
// ----------------------------------------------------------------

.btnPrimary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background: linear-gradient(135deg, $primary, $primary-dk);
  color: #fff;
  border: none;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  white-space: nowrap;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 6px rgba(27, 106, 224, 0.25);

  &:hover {
    background: linear-gradient(135deg, lighten($primary, 4%), $primary);
    box-shadow: 0 4px 14px rgba(27, 106, 224, 0.35);
    transform: translateY(-1px);
  }

  &:active { transform: translateY(0); box-shadow: 0 1px 4px rgba(27, 106, 224, 0.20); }

  &:disabled {
    background: $bg-subtle;
    color: $text-muted;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
}

.btnSecondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 24px;
  background: transparent;
  color: $primary;
  border: 1.5px solid rgba(27, 106, 224, 0.35);
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  white-space: nowrap;

  &:hover {
    background: $primary-lt;
    border-color: $primary;
  }

  &:disabled {
    opacity: 0.40;
    cursor: not-allowed;
  }
}

.btnBack {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: $primary;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 0 0 16px;
  transition: color $transition;

  &:hover { color: $primary-dk; text-decoration: underline; }
}

.btnApprove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 28px;
  background: linear-gradient(135deg, $success, darken($success, 8%));
  color: #fff;
  border: none;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  box-shadow: 0 2px 6px rgba(13, 159, 63, 0.25);
  letter-spacing: 0.2px;

  &:hover {
    box-shadow: 0 4px 14px rgba(13, 159, 63, 0.35);
    transform: translateY(-1px);
  }

  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
}

.btnReject {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 28px;
  background: transparent;
  color: $error;
  border: 1.5px solid rgba(197, 48, 48, 0.35);
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  letter-spacing: 0.2px;

  &:hover {
    background: $error-lt;
    border-color: $error;
  }

  &:disabled { opacity: 0.45; cursor: not-allowed; }
}

// ================================================================
// Phase 3 — Talent View
// ================================================================

// ----------------------------------------------------------------
// Mentor Catalog — Premium Cards
// ----------------------------------------------------------------

.mentorGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  animation: fadeUp 0.3s $ease-out;
}

.mentorCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: $shadow-sm;
  transition: transform $transition-card, box-shadow $transition-card, border-color $transition;
  position: relative;
  overflow: hidden;

  // Subtle gold top accent on hover
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, $gold, transparent);
    opacity: 0;
    transition: opacity $transition-card;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba(201, 168, 76, 0.25);

    &::before { opacity: 1; }
  }
}

.mentorCardHeader {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mentorAvatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, $navy, $navy-mid);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  position: relative;

  // Gold ring
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid rgba(201, 168, 76, 0.40);
  }
}

.mentorName {
  font-size: 16px;
  font-weight: 700;
  color: $text;
  margin: 0 0 2px;
  letter-spacing: -0.1px;
}

.mentorJobTitle {
  font-size: 11.5px;
  color: $text-muted;
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

// Hidden (unused after Phase 7)
.mentorCapacity    { display: none; }
.mentorCapacityFull { display: none; }

.mentorSuperpower {
  font-size: 13px;
  font-weight: 600;
  color: $gold-dk;
  margin: 4px 0 0;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '\2726'; // four-pointed star
    font-size: 11px;
    color: $gold;
  }
}

.mentorAvatarPhoto {
  background-size: cover;
  background-position: center center;
  color: transparent;
  width: 80px;
  height: 80px;
  border: none;
  box-shadow: 0 0 0 3px rgba($gold, 0.25);
}

.mentorBio {
  font-size: 13.5px;
  color: $text-secondary;
  line-height: 1.65;
  margin: 0 0 8px;
}

.mentorDetails {
  flex: 1;
  margin-bottom: 12px;
}

.mentorDetailsToggle {
  font-size: 13px;
  font-weight: 600;
  color: $primary;
  cursor: pointer;
  padding: 4px 0;
  border: none !important;
  background: none !important;
  outline: none !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: $gold-dk;
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
  }

  &::before {
    content: '▸';
    font-size: 11px;
    transition: transform 0.2s ease;
  }
}

.mentorDetailsContent {
  font-size: 13.5px;
  color: $text-secondary;
  line-height: 1.65;
  padding-top: 8px;
  animation: fadeUp 0.3s ease;
}

.mentorChallenge {
  font-size: 13px;
  color: $primary;
  background: rgba($primary, 0.04);
  padding: 10px 14px;
  border-radius: $radius-sm;
  border-left: 3px solid $gold;
  line-height: 1.6;
  margin-top: 10px;
}

.mentorAvailability {
  font-size: 12px;
  color: $text-muted;
  font-style: italic;
  margin: 0;
  padding: 8px 12px;
  background: $bg;
  border-radius: $radius-sm;
  border-left: 2px solid $gold;
}

.mentorCardActions {
  margin-top: 6px;
}

// ----------------------------------------------------------------
// Request Form
// ----------------------------------------------------------------

.requestForm {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeUp 0.3s $ease-out;
}

.formSection {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.formSectionTitle {
  font-size: 15px;
  font-weight: 700;
  color: $text;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid $border;
  letter-spacing: -0.1px;
  position: relative;

  // Gold accent underline (partial)
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 40px;
    height: 2px;
    background: $gold;
  }
}

.mentorSelectList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mentorSelectItem {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1.5px solid $border;
  border-radius: $radius-md;
  cursor: pointer;
  transition: border-color $transition, background $transition, box-shadow $transition;

  &:hover {
    border-color: $primary;
    background: $primary-lt;
    box-shadow: $shadow-xs;
  }
}

.mentorSelectItemChecked {
  border-color: $primary;
  background: $primary-lt;
  box-shadow: 0 0 0 3px $primary-ring;
}

.mentorSelectDisabled {
  opacity: 0.38;
  cursor: not-allowed;

  &:hover { border-color: $border; background: transparent; box-shadow: none; }
}

.mentorSelectCheckbox {
  margin-top: 3px;
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  cursor: pointer;
  accent-color: $primary;
}

.mentorSelectInfo { flex: 1; min-width: 0; }

.mentorSelectName {
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 3px;
  color: $text;
}

.mentorSelectJobTitle {
  font-size: 12px;
  color: $text-muted;
  margin: 0;
}

.messageGroup {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.messageLabel {
  font-size: 13px;
  font-weight: 600;
  color: $text;
}

.messageTextarea {
  width: 100%;
  min-height: 92px;
  padding: 12px 14px;
  border: 1.5px solid $border;
  border-radius: $radius-md;
  font-family: inherit;
  font-size: 13.5px;
  color: $text;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color $transition, box-shadow $transition;
  line-height: 1.65;
  background: $surface;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px $primary-ring;
  }

  &::placeholder {
    color: $text-muted;
    font-style: italic;
  }
}

.formActions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.formError {
  color: $error;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '\26A0'; // warning sign
    font-size: 14px;
  }
}

// ----------------------------------------------------------------
// My Requests
// ----------------------------------------------------------------

.requestList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeUp 0.3s $ease-out;
}

.requestCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 18px 22px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition, border-color $transition;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.requestCardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 14px;
}

.requestTitle {
  font-weight: 700;
  font-size: 15px;
  color: $text;
  margin: 0;
  letter-spacing: -0.1px;
}

// Status badges — refined with subtle borders
.statusBadge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.2px;
}

.statusPending   { background: $warning-lt; color: $warning; border: 1px solid rgba(184, 134, 11, 0.15); }
.statusApproved  { background: $success-lt; color: $success; border: 1px solid rgba(13, 159, 63, 0.15); }
.statusHR        { background: $error-lt;   color: $error;   border: 1px solid rgba(197, 48, 48, 0.15); }
.statusScheduled { background: $info-lt;    color: $info;    border: 1px solid rgba(27, 106, 224, 0.15); }
.statusCancelled { background: $bg-subtle;  color: $text-muted; border: 1px solid $border-lt; }

.requestMentors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mentorTag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 500;
  background: $bg-subtle;
  color: $text-secondary;
}

.mentorTagCurrent  { background: $info-lt;    color: $info;    font-weight: 700; border: 1px solid rgba(27, 106, 224, 0.12); }
.mentorTagApproved { background: $success-lt; color: $success; border: 1px solid rgba(13, 159, 63, 0.12); }
.mentorTagRejected { background: $error-lt;   color: $error;   text-decoration: line-through; border: 1px solid rgba(197, 48, 48, 0.12); }

// ================================================================
// Phase 4 — Mentor Dashboard
// ================================================================

.pendingRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: $shadow-sm;
  transition: transform $transition-card, box-shadow $transition-card, border-color $transition;

  &:hover {
    border-color: rgba(201, 168, 76, 0.30);
    transform: translateX(4px);
    box-shadow: $shadow-md;
  }
}

.pendingRowLeft { flex: 1; min-width: 0; }

.pendingRowHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.stageIndicator {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: $radius-pill;
  font-size: 11px;
  font-weight: 700;
  background: $gold-subtle;
  color: $gold-dk;
  letter-spacing: 0.4px;
  flex-shrink: 0;
  border: 1px solid rgba(201, 168, 76, 0.20);
}

.talentName {
  font-size: 13px;
  color: $text-muted;
  margin: 0 0 4px;
  font-weight: 500;
}

.messagePreview {
  font-size: 13px;
  color: $text-secondary;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.70;
}

.arrowIcon {
  font-size: 24px;
  color: $border;
  flex-shrink: 0;
  transition: color $transition, transform $transition;

  .pendingRow:hover & {
    color: $gold;
    transform: translateX(3px);
  }
}

// Request Detail — elevated card
.requestDetailCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 28px;
  max-width: 740px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-shadow: $shadow-md;
  animation: fadeUp 0.3s $ease-out;
  position: relative;

  // Gold top accent
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 24px;
    right: 24px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $gold, transparent);
    border-radius: 0 0 2px 2px;
  }
}

.detailSection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detailLabel {
  font-size: 11px;
  color: $text-muted;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
}

.detailValue {
  font-size: 16px;
  font-weight: 600;
  color: $text;
  margin: 0;
}

.talentMessage {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.04), rgba(201, 168, 76, 0.08));
  border-left: 3px solid $gold;
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.75;
  color: $text;
  border-radius: 0 $radius-sm $radius-sm 0;
  font-style: italic;
}

.decisionBtns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.rejectHint {
  font-size: 12px;
  color: $text-muted;
  font-style: italic;
  margin: 8px 0 0;
  padding: 10px 14px;
  background: $bg;
  border-radius: $radius-sm;
  border-left: 2px solid $border;
}

.decisionConfirm {
  padding: 16px 20px;
  background: $success-lt;
  color: $success;
  border-radius: $radius-md;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(13, 159, 63, 0.15);

  &::before { content: '\2713'; font-size: 18px; font-weight: 900; }
}

// Request History
.historyCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 16px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition, transform $transition;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-1px);
  }
}

.historyLeft { flex: 1; min-width: 0; }

.historyTitle {
  font-weight: 600;
  font-size: 14px;
  color: $text;
  margin: 0 0 4px;
}

.historyMeta {
  font-size: 12px;
  color: $text-muted;
  margin: 0;
}

.decisionBadge {
  display: inline-flex;
  align-items: center;
  padding: 4px 16px;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.decisionApproved { background: $success-lt; color: $success; border: 1px solid rgba(13, 159, 63, 0.15); }
.decisionRejected { background: $error-lt;   color: $error;   border: 1px solid rgba(197, 48, 48, 0.15); }

// ================================================================
// Phase 5 — HR Admin Panel
// ================================================================

.filterRow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filterBar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filterBtn,
.filterBtnActive {
  padding: 6px 16px;
  border: 1.5px solid $border;
  border-radius: $radius-pill;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: $text-muted;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    border-color: $primary;
    color: $primary;
    background: $primary-lt;
  }
}

.filterBtnActive {
  background: linear-gradient(135deg, $navy, $navy-mid);
  border-color: $navy;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(10, 38, 71, 0.20);
}

.searchInput {
  padding: 8px 14px;
  border: 1.5px solid $border;
  border-radius: $radius-sm;
  font-family: inherit;
  font-size: 13px;
  color: $text;
  flex: 1;
  min-width: 200px;
  transition: border-color $transition, box-shadow $transition;
  background: $surface;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px $primary-ring;
  }

  &::placeholder {
    color: $text-muted;
  }
}

.allRequestRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.allRequestMain {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.allRequestMeta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.hrReviewCard {
  background: $surface;
  border: 1px solid $border;
  border-left: 4px solid $gold;
  border-radius: $radius-md;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.hrReviewHeader {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.hrActionsBar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 4px;
}

// Management lists
.managementList {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeUp 0.3s $ease-out;
}

.managementRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: $shadow-sm;
  transition: opacity $transition, box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.managementRowInactive { opacity: 0.40; }

.managementInfo { flex: 1; min-width: 0; }

.managementName {
  font-weight: 600;
  font-size: 14px;
  color: $text;
  margin: 0 0 3px;
}

.managementMeta {
  font-size: 12px;
  color: $text-muted;
  margin: 0;
}

.managementCapacity { flex-shrink: 0; }

.capacityEdit {
  padding: 6px 14px;
  border: 1.5px dashed $border;
  border-radius: $radius-sm;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: $text-muted;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    border-color: $gold;
    color: $gold-dk;
    border-style: solid;
    background: $gold-subtle;
  }
}

.inlineEditGroup {
  display: flex;
  align-items: center;
  gap: 6px;
}

.inlineInput {
  width: 64px;
  padding: 6px 10px;
  border: 1.5px solid $primary;
  border-radius: $radius-sm;
  font-family: inherit;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 0 0 3px $primary-ring;

  &:focus { outline: none; }
}

.inlineSave {
  padding: 6px 12px;
  background: linear-gradient(135deg, $primary, $primary-dk);
  color: #fff;
  border: none;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;

  &:hover { box-shadow: 0 2px 6px rgba(27, 106, 224, 0.30); }
  &:disabled { opacity: 0.45; }
}

.inlineCancel {
  padding: 6px 12px;
  background: transparent;
  color: $text-muted;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;

  &:hover { background: $bg; }
}

.activeBtn {
  padding: 5px 16px;
  background: $success-lt;
  color: $success;
  border: 1.5px solid rgba(13, 159, 63, 0.18);
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: all $transition;

  &:hover { background: darken(#E6F9ED, 4%); }
}

.inactiveBtn {
  padding: 5px 16px;
  background: $bg-subtle;
  color: $text-muted;
  border: 1.5px solid $border;
  border-radius: $radius-pill;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: all $transition;

  &:hover { background: $bg; }
}

// Capacity Dashboard
.capacityList {
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeUp 0.3s $ease-out;
}

.capacityRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 18px 22px;
  display: grid;
  grid-template-columns: 1fr auto 220px;
  align-items: center;
  gap: 22px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.capacityMentorInfo { min-width: 0; }

.capacityStats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  white-space: nowrap;
}

.capacityStat {
  font-size: 16px;
  font-weight: 700;
  color: $text;
}

.capacityRemaining {
  font-size: 12px;
  font-weight: 600;
  color: $success;
}

.capacityFull { color: $error; }

.capacityBarWrap {
  height: 8px;
  background: $bg-subtle;
  border-radius: $radius-pill;
  overflow: hidden;
}

.capacityBarFill {
  height: 100%;
  border-radius: $radius-pill;
  transition: width 0.6s $ease-out;
}

.barOk   { background: linear-gradient(90deg, #0D9F3F, #34C759); }
.barHigh { background: linear-gradient(90deg, $gold-dk, $gold); }
.barFull { background: linear-gradient(90deg, #C53030, #E53E3E); }

// ================================================================
// Phase 8 — Redesigned Components
// ================================================================

// ----------------------------------------------------------------
// RequestForm — Primary Mentor Card
// ----------------------------------------------------------------

.primaryMentorCard {
  background: $surface;
  border: 2px solid rgba(201, 168, 76, 0.35);
  border-radius: $radius-lg;
  padding: 28px;
  box-shadow: $shadow-md, 0 0 0 1px $gold-subtle;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $gold-dk, $gold, $gold-lt, $gold-dk);
  }
}

.primaryMentorHeader {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.primaryMentorAvatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, $navy, $navy-mid);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2.5px solid $gold;
    box-shadow: $shadow-gold;
  }
}

.primaryMentorInfo {
  flex: 1;
  min-width: 0;
}

.primaryMentorName {
  font-size: 20px;
  font-weight: 700;
  color: $text;
  margin: 0 0 4px;
  letter-spacing: -0.2px;
}

.primaryMentorJobTitle {
  font-size: 12px;
  color: $text-muted;
  margin: 0 0 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.primaryMentorSuperpower {
  font-size: 14px;
  font-weight: 600;
  color: $gold-dk;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '\2726';
    font-size: 12px;
    color: $gold;
  }
}

.primaryMentorBadge {
  display: inline-flex;
  align-items: center;
  padding: 5px 16px;
  border-radius: $radius-pill;
  background: linear-gradient(135deg, $gold-subtle, rgba(201, 168, 76, 0.15));
  color: $gold-dk;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  border: 1px solid rgba(201, 168, 76, 0.30);
  white-space: nowrap;
  flex-shrink: 0;
}

.primaryMentorBio {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.7;
  margin: 0;
}

// ----------------------------------------------------------------
// RequestForm — Backup Mentors
// ----------------------------------------------------------------

.formSectionHint {
  font-size: 13px;
  color: $text-muted;
  line-height: 1.6;
  margin: -8px 0 8px;
}

.backupMentorList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.backupMentorRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid $border;
  border-radius: $radius-md;
  transition: border-color $transition, background $transition, box-shadow $transition;

  &:hover {
    border-color: rgba(27, 106, 224, 0.25);
    background: $primary-lt;
  }
}

.backupMentorRowSelected {
  border-color: $primary;
  background: $primary-lt;
  box-shadow: 0 0 0 2px $primary-ring;
}

.backupMentorInfo {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.backupMentorActions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.backupMentorLabel {
  display: inline-flex;
  padding: 3px 12px;
  border-radius: $radius-pill;
  font-size: 11px;
  font-weight: 700;
  background: $info-lt;
  color: $info;
  border: 1px solid rgba(27, 106, 224, 0.12);
  white-space: nowrap;
}

.backupMentorLabelTertiary {
  display: inline-flex;
  padding: 3px 12px;
  border-radius: $radius-pill;
  font-size: 11px;
  font-weight: 700;
  background: $gold-subtle;
  color: $gold-dk;
  border: 1px solid rgba(201, 168, 76, 0.20);
  white-space: nowrap;
}

// ----------------------------------------------------------------
// MyRequests — Mentor-centric rows
// ----------------------------------------------------------------

.myRequestMentorRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid $border-lt;
  }
}

.myRequestMentorName {
  font-size: 15px;
  font-weight: 600;
  color: $text;
}

.statusQueued {
  background: $bg-subtle;
  color: $text-muted;
  border: 1px solid $border-lt;
}

// ----------------------------------------------------------------
// ResetChoice
// ----------------------------------------------------------------

.resetChoiceCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 28px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: $shadow-md;
}

.resetChoiceText {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.7;
  margin: 0;
}

.resetChoiceWarning {
  font-size: 13px;
  color: $error;
  font-weight: 600;
  margin: 0;
  padding: 10px 14px;
  background: $error-lt;
  border-radius: $radius-sm;
  border-left: 3px solid $error;
}

// ----------------------------------------------------------------
// HR — Redesigned Request Rows
// ----------------------------------------------------------------

.hrRequestRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.hrRequestMain {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.hrRequestNames {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hrRequestTalent {
  font-weight: 700;
  font-size: 14px;
  color: $text;
}

.hrRequestArrow {
  color: $text-muted;
  font-size: 14px;
}

.hrRequestMentor {
  font-weight: 600;
  font-size: 14px;
  color: $primary;
}

.menteeDashboardRow {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-md;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition, border-color $transition;

  &:hover { box-shadow: $shadow-md; }
}

.menteeDashboardRowWarning {
  border-color: rgba(201, 168, 76, 0.45);
  box-shadow: $shadow-sm, 0 0 0 1px rgba(201, 168, 76, 0.14);
}

.menteeDashboardMain {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.menteeDashboardHeader {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.menteeDashboardIdentity {
  min-width: 0;
}

.menteeDashboardBadges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
}

.menteeDashboardMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.menteeDashboardMetaItem {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: $radius-pill;
  background: $bg;
  color: $text-secondary;
  font-size: 12px;
  border: 1px solid $border-lt;
}

.menteeDashboardWarning {
  margin: 0;
  padding: 10px 14px;
  background: $warning-lt;
  border-left: 3px solid $gold;
  border-radius: 0 $radius-sm $radius-sm 0;
  color: darken($warning, 6%);
  font-size: 12px;
  font-weight: 600;
}

.hrRequestActions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hrActionBtn {
  padding: 5px 14px;
  background: transparent;
  color: $text-muted;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  white-space: nowrap;

  &:hover {
    border-color: $primary;
    color: $primary;
    background: $primary-lt;
  }

  &:disabled { opacity: 0.40; cursor: not-allowed; }
}

.hrActionBtnDanger {
  padding: 5px 14px;
  background: transparent;
  color: $text-muted;
  border: 1px solid $border;
  border-radius: $radius-sm;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  white-space: nowrap;

  &:hover {
    border-color: $error;
    color: $error;
    background: $error-lt;
  }

  &:disabled { opacity: 0.40; cursor: not-allowed; }
}

// ----------------------------------------------------------------
// HR — Approved Mentorings (pairs)
// ----------------------------------------------------------------

.approvedPairRow {
  background: $surface;
  border: 1px solid $border;
  border-left: 3px solid $success;
  border-radius: $radius-md;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition;

  &:hover { box-shadow: $shadow-md; }
}

.approvedPairInfo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.approvedPairTalent {
  font-weight: 700;
  font-size: 14px;
  color: $text;
}

.approvedPairArrow {
  color: $gold;
  font-size: 16px;
  font-weight: 700;
}

.approvedPairMentor {
  font-weight: 700;
  font-size: 14px;
  color: $primary;
}

// ----------------------------------------------------------------
// MentorManagement — Form
// ----------------------------------------------------------------

.mentorFormCard {
  background: $surface;
  border: 1px solid $border;
  border-radius: $radius-lg;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: $shadow-md;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: fadeUp 0.25s $ease-out;
}

.mentorFormGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.mentorFormField {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mentorFormFieldFull {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.formInput {
  padding: 9px 14px;
  border: 1.5px solid $border;
  border-radius: $radius-sm;
  font-family: inherit;
  font-size: 13.5px;
  color: $text;
  background: $surface;
  transition: border-color $transition, box-shadow $transition;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px $primary-ring;
  }

  &::placeholder { color: $text-muted; }
}

.managementCapacityLabel {
  font-size: 13px;
  color: $text-muted;
  font-weight: 500;
  flex-shrink: 0;
  padding: 4px 12px;
  background: $bg;
  border-radius: $radius-sm;
}

.deleteConfirm {
  display: flex;
  align-items: center;
  gap: 6px;
}

.deleteConfirmText {
  font-size: 12px;
  font-weight: 600;
  color: $error;
}

```

## `src/webparts/auresApp/components/AuresApp.module.scss.ts`

```ts

require("./AuresApp.module.css");
const styles = {
  auresApp: 'auresApp_7d7abec4',
  appShell: 'appShell_7d7abec4',
  header: 'header_7d7abec4',
  headerLeft: 'headerLeft_7d7abec4',
  headerLogo: 'headerLogo_7d7abec4',
  headerTitle: 'headerTitle_7d7abec4',
  headerTitleAccent: 'headerTitleAccent_7d7abec4',
  headerUser: 'headerUser_7d7abec4',
  roleSwitch: 'roleSwitch_7d7abec4',
  roleBtn: 'roleBtn_7d7abec4',
  roleBtnActive: 'roleBtnActive_7d7abec4',
  nav: 'nav_7d7abec4',
  navTab: 'navTab_7d7abec4',
  navTabActive: 'navTabActive_7d7abec4',
  navBadge: 'navBadge_7d7abec4',
  fadeUp: 'fadeUp_7d7abec4',
  content: 'content_7d7abec4',
  fadeIn: 'fadeIn_7d7abec4',
  accessDenied: 'accessDenied_7d7abec4',
  accessDeniedIcon: 'accessDeniedIcon_7d7abec4',
  pageTitle: 'pageTitle_7d7abec4',
  pageHeader: 'pageHeader_7d7abec4',
  loading: 'loading_7d7abec4',
  spin: 'spin_7d7abec4',
  emptyState: 'emptyState_7d7abec4',
  sectionHint: 'sectionHint_7d7abec4',
  btnPrimary: 'btnPrimary_7d7abec4',
  btnSecondary: 'btnSecondary_7d7abec4',
  btnBack: 'btnBack_7d7abec4',
  btnApprove: 'btnApprove_7d7abec4',
  btnReject: 'btnReject_7d7abec4',
  mentorGrid: 'mentorGrid_7d7abec4',
  mentorCard: 'mentorCard_7d7abec4',
  mentorCardHeader: 'mentorCardHeader_7d7abec4',
  mentorAvatar: 'mentorAvatar_7d7abec4',
  mentorName: 'mentorName_7d7abec4',
  mentorJobTitle: 'mentorJobTitle_7d7abec4',
  mentorCapacity: 'mentorCapacity_7d7abec4',
  mentorCapacityFull: 'mentorCapacityFull_7d7abec4',
  mentorSuperpower: 'mentorSuperpower_7d7abec4',
  mentorAvatarPhoto: 'mentorAvatarPhoto_7d7abec4',
  mentorBio: 'mentorBio_7d7abec4',
  mentorDetails: 'mentorDetails_7d7abec4',
  mentorDetailsToggle: 'mentorDetailsToggle_7d7abec4',
  mentorDetailsContent: 'mentorDetailsContent_7d7abec4',
  mentorChallenge: 'mentorChallenge_7d7abec4',
  mentorAvailability: 'mentorAvailability_7d7abec4',
  mentorCardActions: 'mentorCardActions_7d7abec4',
  requestForm: 'requestForm_7d7abec4',
  formSection: 'formSection_7d7abec4',
  formSectionTitle: 'formSectionTitle_7d7abec4',
  mentorSelectList: 'mentorSelectList_7d7abec4',
  mentorSelectItem: 'mentorSelectItem_7d7abec4',
  mentorSelectItemChecked: 'mentorSelectItemChecked_7d7abec4',
  mentorSelectDisabled: 'mentorSelectDisabled_7d7abec4',
  mentorSelectCheckbox: 'mentorSelectCheckbox_7d7abec4',
  mentorSelectInfo: 'mentorSelectInfo_7d7abec4',
  mentorSelectName: 'mentorSelectName_7d7abec4',
  mentorSelectJobTitle: 'mentorSelectJobTitle_7d7abec4',
  messageGroup: 'messageGroup_7d7abec4',
  messageLabel: 'messageLabel_7d7abec4',
  messageTextarea: 'messageTextarea_7d7abec4',
  formActions: 'formActions_7d7abec4',
  formError: 'formError_7d7abec4',
  requestList: 'requestList_7d7abec4',
  requestCard: 'requestCard_7d7abec4',
  requestCardHeader: 'requestCardHeader_7d7abec4',
  requestTitle: 'requestTitle_7d7abec4',
  statusBadge: 'statusBadge_7d7abec4',
  statusPending: 'statusPending_7d7abec4',
  statusApproved: 'statusApproved_7d7abec4',
  statusHR: 'statusHR_7d7abec4',
  statusScheduled: 'statusScheduled_7d7abec4',
  statusCancelled: 'statusCancelled_7d7abec4',
  requestMentors: 'requestMentors_7d7abec4',
  mentorTag: 'mentorTag_7d7abec4',
  mentorTagCurrent: 'mentorTagCurrent_7d7abec4',
  mentorTagApproved: 'mentorTagApproved_7d7abec4',
  mentorTagRejected: 'mentorTagRejected_7d7abec4',
  pendingRow: 'pendingRow_7d7abec4',
  pendingRowLeft: 'pendingRowLeft_7d7abec4',
  pendingRowHeader: 'pendingRowHeader_7d7abec4',
  stageIndicator: 'stageIndicator_7d7abec4',
  talentName: 'talentName_7d7abec4',
  messagePreview: 'messagePreview_7d7abec4',
  arrowIcon: 'arrowIcon_7d7abec4',
  requestDetailCard: 'requestDetailCard_7d7abec4',
  detailSection: 'detailSection_7d7abec4',
  detailLabel: 'detailLabel_7d7abec4',
  detailValue: 'detailValue_7d7abec4',
  talentMessage: 'talentMessage_7d7abec4',
  decisionBtns: 'decisionBtns_7d7abec4',
  rejectHint: 'rejectHint_7d7abec4',
  decisionConfirm: 'decisionConfirm_7d7abec4',
  historyCard: 'historyCard_7d7abec4',
  historyLeft: 'historyLeft_7d7abec4',
  historyTitle: 'historyTitle_7d7abec4',
  historyMeta: 'historyMeta_7d7abec4',
  decisionBadge: 'decisionBadge_7d7abec4',
  decisionApproved: 'decisionApproved_7d7abec4',
  decisionRejected: 'decisionRejected_7d7abec4',
  filterRow: 'filterRow_7d7abec4',
  filterBar: 'filterBar_7d7abec4',
  filterBtn: 'filterBtn_7d7abec4',
  filterBtnActive: 'filterBtnActive_7d7abec4',
  searchInput: 'searchInput_7d7abec4',
  allRequestRow: 'allRequestRow_7d7abec4',
  allRequestMain: 'allRequestMain_7d7abec4',
  allRequestMeta: 'allRequestMeta_7d7abec4',
  hrReviewCard: 'hrReviewCard_7d7abec4',
  hrReviewHeader: 'hrReviewHeader_7d7abec4',
  hrActionsBar: 'hrActionsBar_7d7abec4',
  managementList: 'managementList_7d7abec4',
  managementRow: 'managementRow_7d7abec4',
  managementRowInactive: 'managementRowInactive_7d7abec4',
  managementInfo: 'managementInfo_7d7abec4',
  managementName: 'managementName_7d7abec4',
  managementMeta: 'managementMeta_7d7abec4',
  managementCapacity: 'managementCapacity_7d7abec4',
  capacityEdit: 'capacityEdit_7d7abec4',
  inlineEditGroup: 'inlineEditGroup_7d7abec4',
  inlineInput: 'inlineInput_7d7abec4',
  inlineSave: 'inlineSave_7d7abec4',
  inlineCancel: 'inlineCancel_7d7abec4',
  activeBtn: 'activeBtn_7d7abec4',
  inactiveBtn: 'inactiveBtn_7d7abec4',
  capacityList: 'capacityList_7d7abec4',
  capacityRow: 'capacityRow_7d7abec4',
  capacityMentorInfo: 'capacityMentorInfo_7d7abec4',
  capacityStats: 'capacityStats_7d7abec4',
  capacityStat: 'capacityStat_7d7abec4',
  capacityRemaining: 'capacityRemaining_7d7abec4',
  capacityFull: 'capacityFull_7d7abec4',
  capacityBarWrap: 'capacityBarWrap_7d7abec4',
  capacityBarFill: 'capacityBarFill_7d7abec4',
  barOk: 'barOk_7d7abec4',
  barHigh: 'barHigh_7d7abec4',
  barFull: 'barFull_7d7abec4',
  primaryMentorCard: 'primaryMentorCard_7d7abec4',
  primaryMentorHeader: 'primaryMentorHeader_7d7abec4',
  primaryMentorAvatar: 'primaryMentorAvatar_7d7abec4',
  primaryMentorInfo: 'primaryMentorInfo_7d7abec4',
  primaryMentorName: 'primaryMentorName_7d7abec4',
  primaryMentorJobTitle: 'primaryMentorJobTitle_7d7abec4',
  primaryMentorSuperpower: 'primaryMentorSuperpower_7d7abec4',
  primaryMentorBadge: 'primaryMentorBadge_7d7abec4',
  primaryMentorBio: 'primaryMentorBio_7d7abec4',
  formSectionHint: 'formSectionHint_7d7abec4',
  backupMentorList: 'backupMentorList_7d7abec4',
  backupMentorRow: 'backupMentorRow_7d7abec4',
  backupMentorRowSelected: 'backupMentorRowSelected_7d7abec4',
  backupMentorInfo: 'backupMentorInfo_7d7abec4',
  backupMentorActions: 'backupMentorActions_7d7abec4',
  backupMentorLabel: 'backupMentorLabel_7d7abec4',
  backupMentorLabelTertiary: 'backupMentorLabelTertiary_7d7abec4',
  myRequestMentorRow: 'myRequestMentorRow_7d7abec4',
  myRequestMentorName: 'myRequestMentorName_7d7abec4',
  statusQueued: 'statusQueued_7d7abec4',
  resetChoiceCard: 'resetChoiceCard_7d7abec4',
  resetChoiceText: 'resetChoiceText_7d7abec4',
  resetChoiceWarning: 'resetChoiceWarning_7d7abec4',
  hrRequestRow: 'hrRequestRow_7d7abec4',
  hrRequestMain: 'hrRequestMain_7d7abec4',
  hrRequestNames: 'hrRequestNames_7d7abec4',
  hrRequestTalent: 'hrRequestTalent_7d7abec4',
  hrRequestArrow: 'hrRequestArrow_7d7abec4',
  hrRequestMentor: 'hrRequestMentor_7d7abec4',
  menteeDashboardRow: 'menteeDashboardRow_7d7abec4',
  menteeDashboardRowWarning: 'menteeDashboardRowWarning_7d7abec4',
  menteeDashboardMain: 'menteeDashboardMain_7d7abec4',
  menteeDashboardHeader: 'menteeDashboardHeader_7d7abec4',
  menteeDashboardIdentity: 'menteeDashboardIdentity_7d7abec4',
  menteeDashboardBadges: 'menteeDashboardBadges_7d7abec4',
  menteeDashboardMeta: 'menteeDashboardMeta_7d7abec4',
  menteeDashboardMetaItem: 'menteeDashboardMetaItem_7d7abec4',
  menteeDashboardWarning: 'menteeDashboardWarning_7d7abec4',
  hrRequestActions: 'hrRequestActions_7d7abec4',
  hrActionBtn: 'hrActionBtn_7d7abec4',
  hrActionBtnDanger: 'hrActionBtnDanger_7d7abec4',
  approvedPairRow: 'approvedPairRow_7d7abec4',
  approvedPairInfo: 'approvedPairInfo_7d7abec4',
  approvedPairTalent: 'approvedPairTalent_7d7abec4',
  approvedPairArrow: 'approvedPairArrow_7d7abec4',
  approvedPairMentor: 'approvedPairMentor_7d7abec4',
  mentorFormCard: 'mentorFormCard_7d7abec4',
  mentorFormGrid: 'mentorFormGrid_7d7abec4',
  mentorFormField: 'mentorFormField_7d7abec4',
  mentorFormFieldFull: 'mentorFormFieldFull_7d7abec4',
  formInput: 'formInput_7d7abec4',
  managementCapacityLabel: 'managementCapacityLabel_7d7abec4',
  deleteConfirm: 'deleteConfirm_7d7abec4',
  deleteConfirmText: 'deleteConfirmText_7d7abec4',
  shimmer: 'shimmer_7d7abec4',
  pulseGold: 'pulseGold_7d7abec4',
  slideInRight: 'slideInRight_7d7abec4'
};

export default styles;

```

## `src/webparts/auresApp/components/AuresApp.tsx`

```tsx
import * as React from 'react';
import { SPFI } from '@pnp/sp';
import styles from './AuresApp.module.scss';
import { IAuresAppProps } from './IAuresAppProps';
import { ICurrentUser, UserRole, RequestStatus } from '../../../services/interfaces';
import { RoleService } from '../../../services/RoleService';
import { MentoringService } from '../../../services/MentoringService';
import { AppView, NavigateFn } from './AppView';
import AppShell from './AppShell';
import AccessDenied from './AccessDenied';
import MentorCatalog from './talent/MentorCatalog';
import RequestForm from './talent/RequestForm';
import MyRequests from './talent/MyRequests';
import ResetChoice from './talent/ResetChoice';
import PendingRequests from './mentor/PendingRequests';
import RequestDetail from './mentor/RequestDetail';
import RequestHistory from './mentor/RequestHistory';
import MenteesDashboard from './hr/MenteesDashboard';
import ApprovedMentorings from './hr/ApprovedMentorings';
import MentorManagement from './hr/MentorManagement';
import TalentManagement from './hr/TalentManagement';
import CapacityDashboard from './hr/CapacityDashboard';

const AuresApp: React.FC<IAuresAppProps> = ({ sp, hrEmail }) => {
  const [currentUser, setCurrentUser] = React.useState<ICurrentUser | null>(null);
  const [loading, setLoading]         = React.useState<boolean>(true);
  const [error, setError]             = React.useState<string | null>(null);
  const [view, setView]               = React.useState<AppView | null>(null);
  const [navParams, setNavParams]     = React.useState<Record<string, unknown>>({});
  const [navBadges, setNavBadges]     = React.useState<Partial<Record<AppView, number>>>({});
  const [hasActiveRequests, setHasActiveRequests] = React.useState(false);

  const checkActiveRequests = React.useCallback((user: ICurrentUser) => {
    if (!user.roles.includes(UserRole.Talent) || !user.talentRecord) {
      setHasActiveRequests(false);
      return;
    }
    new MentoringService(sp).getMyRequests(user.talentRecord.Id)
      .then(reqs => {
        const active = reqs.some(r =>
          r.RequestStatus === RequestStatus.Pending ||
          r.RequestStatus === RequestStatus.Approved ||
          r.RequestStatus === RequestStatus.HR_Review ||
          r.RequestStatus === RequestStatus.Scheduled
        );
        setHasActiveRequests(active);
      })
      .catch(() => setHasActiveRequests(true)); // fallback: show tabs
  }, [sp]);

  React.useEffect(() => {
    const roleService = new RoleService(sp);
    roleService.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
        setView(resolveDefaultView(user));
        checkActiveRequests(user);
        if (user.roles.includes(UserRole.Mentor) && user.mentorRecord) {
          new MentoringService(sp).getPendingRequestsForMentor(user.mentorRecord.Id)
            .then(items => { if (items.length > 0) setNavBadges({ PendingRequests: items.length }); })
            .catch(() => { /* best-effort */ });
        }
      })
      .catch(err => setError(err?.message ?? 'Neznama chyba'))
      .finally(() => setLoading(false));
  }, [sp, checkActiveRequests]);

  const navigate: NavigateFn = React.useCallback(
    (nextView, params = {}) => {
      setView(nextView);
      setNavParams(params);
    },
    []
  );

  const handleRequestsChanged = React.useCallback(() => {
    if (currentUser) checkActiveRequests(currentUser);
  }, [currentUser, checkActiveRequests]);

  if (loading) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Načítám...</p></div>;
  }

  if (error) {
    return <div className={styles.auresApp}><p style={{ padding: 16 }}>Chyba při inicializaci: {error}</p></div>;
  }

  if (!currentUser || view === 'AccessDenied') {
    return (
      <div className={styles.auresApp}>
        <AccessDenied />
      </div>
    );
  }

  return (
    <div className={styles.auresApp}>
      <AppShell
        currentUser={currentUser}
        currentView={view!}
        navigate={navigate}
        navBadges={navBadges}
        hasActiveRequests={hasActiveRequests}
      >
        {renderView(view, currentUser, sp, navigate, navParams, hrEmail, handleRequestsChanged)}
      </AppShell>
    </div>
  );
};

function resolveDefaultView(user: ICurrentUser): AppView {
  if (user.roles.includes(UserRole.Unknown) && user.roles.length === 1) return 'AccessDenied';
  if (user.roles.includes(UserRole.Talent))  return 'MentorCatalog';
  if (user.roles.includes(UserRole.Mentor))  return 'PendingRequests';
  if (user.roles.includes(UserRole.HR))      return 'MenteesDashboard';
  return 'AccessDenied';
}

function renderView(
  view: AppView | null,
  currentUser: ICurrentUser,
  sp: SPFI,
  navigate: NavigateFn,
  params: Record<string, unknown>,
  hrEmail: string,
  onRequestsChanged: () => void
): React.ReactElement {
  switch (view) {
    // Talent
    case 'MentorCatalog': return <MentorCatalog sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestForm':   return <RequestForm   sp={sp} currentUser={currentUser} navigate={navigate} hrEmail={hrEmail} preselectedMentorId={params.preselectedMentorId as number | undefined} />;
    case 'MyRequests':    return <MyRequests    sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'ResetChoice':   return <ResetChoice  sp={sp} currentUser={currentUser} navigate={navigate} onRequestsChanged={onRequestsChanged} />;
    // Mentor
    case 'PendingRequests': return <PendingRequests sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'RequestDetail':   return <RequestDetail   sp={sp} currentUser={currentUser} navigate={navigate} requestId={params.requestId as number | undefined} hrEmail={hrEmail} />;
    case 'RequestHistory':  return <RequestHistory  sp={sp} currentUser={currentUser} navigate={navigate} />;
    // HR
    case 'MenteesDashboard': return <MenteesDashboard sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'ApprovedMentorings': return <ApprovedMentorings sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'MentorManagement':  return <MentorManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'TalentManagement':  return <TalentManagement sp={sp} currentUser={currentUser} navigate={navigate} />;
    case 'CapacityDashboard': return <CapacityDashboard sp={sp} currentUser={currentUser} navigate={navigate} />;
    default:                  return <div>Načítám…</div>;
  }
}

export default AuresApp;

```

## `src/webparts/auresApp/components/IAuresAppProps.ts`

```ts
import { SPFI } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAuresAppProps {
  sp: SPFI;
  context: WebPartContext;
  hrEmail: string;
}

```

## `src/webparts/auresApp/components/hr/AllRequests.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, StageDecision, ISPLookup } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IAllRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const AllRequests: React.FC<IAllRequestsProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [search, setSearch]     = React.useState('');
  const [loading, setLoading]   = React.useState(true);
  const [processing, setProcessing] = React.useState<number | null>(null);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r =>
        r.RequestStatus === RequestStatus.Pending || r.RequestStatus === RequestStatus.HR_Review
      )))
      .catch(() => setRequests(MOCK_REQUESTS.filter(r =>
        r.RequestStatus === RequestStatus.Pending || r.RequestStatus === RequestStatus.HR_Review
      )))
      .finally(() => setLoading(false));
  }, [sp]);

  const getCurrentMentor = (req: IMentoringRequest): ISPLookup | undefined => {
    if (req.CurrentStage === 1) return req.Mentor1Ref;
    if (req.CurrentStage === 2) return req.Mentor2Ref;
    if (req.CurrentStage === 3) return req.Mentor3Ref;
    return req.Mentor1Ref;
  };

  const getStatusLabel = (req: IMentoringRequest): string => {
    if (req.RequestStatus === RequestStatus.HR_Review) return 'Čeká na schválení HR';
    const mentor = getCurrentMentor(req);
    return `Čeká na schválení — ${mentor?.Title ?? 'mentor'}`;
  };

  const getStatusClass = (req: IMentoringRequest): string => {
    if (req.RequestStatus === RequestStatus.HR_Review) return styles.statusHR;
    return styles.statusPending;
  };

  const handleHRApprove = async (req: IMentoringRequest): Promise<void> => {
    setProcessing(req.Id);
    try {
      await new MentoringService(sp).makeDecision(
        req.Id, req.CurrentStage, StageDecision.Approved, currentUser.id
      );
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== req.Id));
    setProcessing(null);
  };

  const handleHRSchedule = async (reqId: number): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, RequestStatus.Scheduled);
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  const handleHRCancel = async (reqId: number): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, RequestStatus.Cancelled);
    } catch { /* lokalni dev */ }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  const filtered = requests.filter(r => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const mentor = getCurrentMentor(r);
    return r.TalentRef.Title.toLowerCase().includes(q)
      || (mentor?.Title ?? '').toLowerCase().includes(q);
  });

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Čekající žádosti ({requests.length})</h2>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Hledat talent nebo mentora…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Žádné žádosti nečekají na vyřízení.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {filtered.map(req => {
            const mentor = getCurrentMentor(req);
            const isProcessing = processing === req.Id;
            const isHRReview = req.RequestStatus === RequestStatus.HR_Review;

            return (
              <div key={req.Id} className={styles.hrRequestRow}>
                <div className={styles.hrRequestMain}>
                  <div className={styles.hrRequestNames}>
                    <span className={styles.hrRequestTalent}>{req.TalentRef.Title}</span>
                    <span className={styles.hrRequestArrow}>&rarr;</span>
                    <span className={styles.hrRequestMentor}>{mentor?.Title ?? '—'}</span>
                  </div>
                  <span className={[styles.statusBadge, getStatusClass(req)].join(' ')}>
                    {getStatusLabel(req)}
                  </span>
                </div>
                <div className={styles.hrRequestActions}>
                  {isHRReview ? (
                    <button
                      className={styles.hrActionBtn}
                      disabled={isProcessing}
                      onClick={() => { void handleHRSchedule(req.Id); }}
                      title="Naplánovat mentoring"
                    >
                      Naplánovat
                    </button>
                  ) : (
                    <button
                      className={styles.hrActionBtn}
                      disabled={isProcessing}
                      onClick={() => { void handleHRApprove(req); }}
                      title="Schválit za mentora"
                    >
                      Schválit
                    </button>
                  )}
                  <button
                    className={styles.hrActionBtnDanger}
                    disabled={isProcessing}
                    onClick={() => { void handleHRCancel(req.Id); }}
                    title="Zrušit žádost"
                  >
                    Zrušit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllRequests;

```

## `src/webparts/auresApp/components/hr/ApprovedMentorings.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, ISPLookup, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IApprovedMentoringsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const ApprovedMentorings: React.FC<IApprovedMentoringsProps> = ({ sp }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r =>
        r.RequestStatus === RequestStatus.Approved || r.RequestStatus === RequestStatus.Scheduled
      )))
      .catch(() => setRequests(MOCK_REQUESTS.filter(r =>
        r.RequestStatus === RequestStatus.Approved || r.RequestStatus === RequestStatus.Scheduled
      )))
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám domluvené mentoringy…</div>;

  const getApprovedMentor = (req: IMentoringRequest): ISPLookup | undefined => {
    if (req.Stage1Decision === StageDecision.Approved) return req.Mentor1Ref;
    if (req.Stage2Decision === StageDecision.Approved) return req.Mentor2Ref;
    if (req.Stage3Decision === StageDecision.Approved) return req.Mentor3Ref;
    return undefined;
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Domluvené mentoringy ({requests.length})</h2>
      <p className={styles.sectionHint}>
        Přehled schválených mentorských párů. Další koordinaci řeší HR mimo systém.
      </p>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Zatím nejsou žádné domluvené mentoringy.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => {
            const mentor = getApprovedMentor(req);
            return (
              <div key={req.Id} className={styles.approvedPairRow}>
                <div className={styles.approvedPairInfo}>
                  <span className={styles.approvedPairTalent}>{req.TalentRef.Title}</span>
                  <span className={styles.approvedPairArrow}>&harr;</span>
                  <span className={styles.approvedPairMentor}>{mentor?.Title ?? '—'}</span>
                </div>
                <span className={[
                  styles.statusBadge,
                  req.RequestStatus === RequestStatus.Scheduled ? styles.statusScheduled : styles.statusApproved
                ].join(' ')}>
                  {req.RequestStatus === RequestStatus.Scheduled ? 'Naplánováno' : 'Schváleno'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovedMentorings;

```

## `src/webparts/auresApp/components/hr/CapacityDashboard.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, IMentoringRequest, ICurrentUser, RequestStatus, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS, MOCK_REQUESTS } from '../../../../utils/mockData';

interface ICapacityDashboardProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const CapacityDashboard: React.FC<ICapacityDashboardProps> = ({ sp }) => {
  const [mentors, setMentors]   = React.useState<IMentor[]>([]);
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const svc = new MentoringService(sp);
    Promise.all([svc.getMentors(), svc.getAllRequests()])
      .then(([m, r]) => { setMentors(m); setRequests(r); })
      .catch(() => {
        setMentors(MOCK_MENTORS.filter(m => m.IsActive));
        setRequests(MOCK_REQUESTS);
      })
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám dashboard…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Kapacitní dashboard</h2>
      <div className={styles.capacityList}>
        {mentors.map(mentor => {
          const approved  = countApproved(mentor.Id, requests);
          const remaining = Math.max(0, mentor.Capacity - approved);
          const pct       = mentor.Capacity > 0
            ? Math.min(100, Math.round((approved / mentor.Capacity) * 100))
            : 100;
          const barClass  = pct >= 100 ? styles.barFull : pct >= 75 ? styles.barHigh : styles.barOk;

          return (
            <div key={mentor.Id} className={styles.capacityRow}>
              <div className={styles.capacityMentorInfo}>
                <p className={styles.managementName}>{mentor.Title}</p>
                <p className={styles.managementMeta}>{mentor.JobTitle}</p>
              </div>
              <div className={styles.capacityStats}>
                <span className={styles.capacityStat}>{approved} / {mentor.Capacity}</span>
                <span className={[
                  styles.capacityRemaining,
                  remaining === 0 ? styles.capacityFull : ''
                ].filter(Boolean).join(' ')}>
                  {remaining > 0 ? `${remaining} volných` : 'Plno'}
                </span>
              </div>
              <div className={styles.capacityBarWrap}>
                <div
                  className={[styles.capacityBarFill, barClass].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function countApproved(mentorId: number, reqs: IMentoringRequest[]): number {
  return reqs.filter(r =>
    r.RequestStatus === RequestStatus.Approved && (
      (r.Mentor1Ref?.Id === mentorId && r.Stage1Decision === StageDecision.Approved) ||
      (r.Mentor2Ref?.Id === mentorId && r.Stage2Decision === StageDecision.Approved) ||
      (r.Mentor3Ref?.Id === mentorId && r.Stage3Decision === StageDecision.Approved)
    )
  ).length;
}

export default CapacityDashboard;

```

## `src/webparts/auresApp/components/hr/HRReviewQueue.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IHRReviewQueueProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const HRReviewQueue: React.FC<IHRReviewQueueProps> = ({ sp }) => {
  const [requests, setRequests]     = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [processing, setProcessing] = React.useState<number | null>(null);

  React.useEffect(() => {
    new MentoringService(sp).getAllRequests()
      .then(all => setRequests(all.filter(r => r.RequestStatus === RequestStatus.HR_Review)))
      .catch(() => setRequests(MOCK_REQUESTS.filter(r => r.RequestStatus === RequestStatus.HR_Review)))
      .finally(() => setLoading(false));
  }, [sp]);

  const handleAction = async (reqId: number, newStatus: RequestStatus): Promise<void> => {
    setProcessing(reqId);
    try {
      await new MentoringService(sp).setRequestStatus(reqId, newStatus);
    } catch {
      // lokalni dev — ignoruj chybu SP
    }
    setRequests(prev => prev.filter(r => r.Id !== reqId));
    setProcessing(null);
  };

  if (loading) return <div className={styles.loading}>Načítám HR frontu…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>HR Fronta ({requests.length})</h2>
      <p className={styles.sectionHint}>
        Žádosti odmítnuté všemi mentory — vyžadují ruční řešení HR.
      </p>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Fronta je prázdná. Žádné žádosti nečekají na HR.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => {
            const isProcessing = processing === req.Id;
            const mentors = [req.Mentor1Ref, req.Mentor2Ref, req.Mentor3Ref].filter(Boolean);
            return (
              <div key={req.Id} className={styles.hrReviewCard}>
                <div className={styles.hrReviewHeader}>
                  <span className={styles.requestTitle}>{req.Title}</span>
                  <span className={styles.talentName}>{req.TalentRef.Title}</span>
                </div>
                <div className={styles.requestMentors}>
                  {mentors.map((m, i) => m && (
                    <span key={i} className={[styles.mentorTag, styles.mentorTagRejected].join(' ')}>
                      #{i + 1} {m.Title}
                    </span>
                  ))}
                </div>
                <div className={styles.hrActionsBar}>
                  <button
                    className={styles.btnApprove}
                    disabled={isProcessing}
                    onClick={() => { void handleAction(req.Id, RequestStatus.Scheduled); }}
                  >
                    Naplánovat
                  </button>
                  <button
                    className={styles.btnReject}
                    disabled={isProcessing}
                    onClick={() => { void handleAction(req.Id, RequestStatus.Cancelled); }}
                  >
                    Zrušit žádost
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HRReviewQueue;

```

## `src/webparts/auresApp/components/hr/MenteesDashboard.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import {
  ICurrentUser,
  IMentoringRequest,
  ISPLookup,
  ITalent,
  RequestStatus,
  StageDecision
} from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS, MOCK_TALENTS } from '../../../../utils/mockData';

type DashboardFilter = 'all' | 'needsHr' | 'waiting' | 'warning';
type DashboardStatus = 'no_request' | 'pending' | 'hr_review' | 'approved' | 'scheduled';

interface IMenteesDashboardProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

interface IMenteeDashboardRow {
  talent: ITalent;
  activeRequest?: IMentoringRequest;
  status: DashboardStatus;
  statusLabel: string;
  detailLabel: string;
  mentorLabel: string;
  actionLabel?: string;
  statusClassName: string;
  hasMultipleActiveRequests: boolean;
  searchText: string;
}

const ACTIVE_STATUSES: RequestStatus[] = [
  RequestStatus.Pending,
  RequestStatus.HR_Review,
  RequestStatus.Approved,
  RequestStatus.Scheduled
];

const FILTER_OPTIONS: Array<{ id: DashboardFilter; label: string }> = [
  { id: 'all', label: 'Všichni' },
  { id: 'needsHr', label: 'Vyžaduje HR' },
  { id: 'waiting', label: 'Čeká na mentora' },
  { id: 'warning', label: 'Více aktivních' }
];

const MenteesDashboard: React.FC<IMenteesDashboardProps> = ({ sp, currentUser }) => {
  const [talents, setTalents] = React.useState<ITalent[]>([]);
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<DashboardFilter>('all');
  const [processingId, setProcessingId] = React.useState<number | null>(null);

  const loadData = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const svc = new MentoringService(sp);
      const [allTalents, allRequests] = await Promise.all([
        svc.getAllTalentsForAdmin(),
        svc.getAllRequests()
      ]);
      setTalents(allTalents);
      setRequests(allRequests);
    } catch {
      setTalents(MOCK_TALENTS);
      setRequests(MOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  }, [sp]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const rows = buildRows(talents, requests);
  const filteredRows = rows.filter(row => matchesFilter(row, activeFilter) && matchesSearch(row, search));

  const handleApprove = async (request: IMentoringRequest): Promise<void> => {
    setProcessingId(request.Id);
    try {
      await new MentoringService(sp).makeDecision(
        request.Id,
        request.CurrentStage,
        StageDecision.Approved,
        currentUser.id
      );
    } catch {
      // lokalni dev fallback
    }
    await loadData();
    setProcessingId(null);
  };

  const handleSchedule = async (requestId: number): Promise<void> => {
    setProcessingId(requestId);
    try {
      await new MentoringService(sp).setRequestStatus(requestId, RequestStatus.Scheduled);
    } catch {
      // lokalni dev fallback
    }
    await loadData();
    setProcessingId(null);
  };

  const handleCancel = async (requestId: number): Promise<void> => {
    setProcessingId(requestId);
    try {
      await new MentoringService(sp).setRequestStatus(requestId, RequestStatus.Cancelled);
    } catch {
      // lokalni dev fallback
    }
    await loadData();
    setProcessingId(null);
  };

  if (loading) return <div className={styles.loading}>Načítám dashboard mentees…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Mentees dashboard ({rows.length})</h2>
      <p className={styles.sectionHint}>
        Talent-centric přehled. HR hned vidí, kdo nemá request, kdo čeká na mentora a kde je nutný zásah.
      </p>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Hledat mentee nebo mentora…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filterBar}>
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.id}
              className={activeFilter === option.id ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setActiveFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Žádní mentees neodpovídají aktuálním filtrům.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {filteredRows.map(row => {
            const isProcessing = processingId === row.activeRequest?.Id;

            return (
              <div
                key={row.talent.Id}
                className={[
                  styles.menteeDashboardRow,
                  !row.talent.IsActive ? styles.managementRowInactive : '',
                  row.hasMultipleActiveRequests ? styles.menteeDashboardRowWarning : ''
                ].filter(Boolean).join(' ')}
              >
                <div className={styles.menteeDashboardMain}>
                  <div className={styles.menteeDashboardHeader}>
                    <div className={styles.menteeDashboardIdentity}>
                      <p className={styles.managementName}>{row.talent.Title}</p>
                    </div>
                    <div className={styles.menteeDashboardBadges}>
                      {!row.talent.IsActive && (
                        <span className={[styles.statusBadge, styles.statusCancelled].join(' ')}>
                          Neaktivní talent
                        </span>
                      )}
                      <span className={[styles.statusBadge, row.statusClassName].join(' ')}>
                        {row.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className={styles.menteeDashboardMeta}>
                    <span className={styles.menteeDashboardMetaItem}>
                      Mentor: <strong>{row.mentorLabel}</strong>
                    </span>
                    <span className={styles.menteeDashboardMetaItem}>{row.detailLabel}</span>
                    {row.activeRequest && (
                      <span className={styles.menteeDashboardMetaItem}>
                        Žádost {row.activeRequest.Title}
                      </span>
                    )}
                  </div>

                  {row.hasMultipleActiveRequests && (
                    <p className={styles.menteeDashboardWarning}>
                      Talent má více aktivních žádostí. Dashboard zobrazuje nejnovější request.
                    </p>
                  )}
                </div>

                <div className={styles.hrRequestActions}>
                  {row.activeRequest && row.status === 'pending' && (
                    <>
                      <button
                        className={styles.hrActionBtn}
                        disabled={isProcessing}
                        onClick={() => { void handleApprove(row.activeRequest!); }}
                        title="Schválit za aktuálního mentora"
                      >
                        Schválit za mentora
                      </button>
                      <button
                        className={styles.hrActionBtnDanger}
                        disabled={isProcessing}
                        onClick={() => { void handleCancel(row.activeRequest!.Id); }}
                        title="Zrušit žádost"
                      >
                        Zrušit
                      </button>
                    </>
                  )}

                  {row.activeRequest && row.status === 'hr_review' && (
                    <>
                      <button
                        className={styles.hrActionBtn}
                        disabled={isProcessing}
                        onClick={() => { void handleSchedule(row.activeRequest!.Id); }}
                        title="Naplánovat mentoring"
                      >
                        Naplánovat
                      </button>
                      <button
                        className={styles.hrActionBtnDanger}
                        disabled={isProcessing}
                        onClick={() => { void handleCancel(row.activeRequest!.Id); }}
                        title="Zrušit žádost"
                      >
                        Zrušit
                      </button>
                    </>
                  )}

                  {row.activeRequest && row.status === 'approved' && (
                    <button
                      className={styles.hrActionBtn}
                      disabled={isProcessing}
                      onClick={() => { void handleSchedule(row.activeRequest!.Id); }}
                      title="Označit jako naplánované"
                    >
                      Naplánovat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function buildRows(talents: ITalent[], requests: IMentoringRequest[]): IMenteeDashboardRow[] {
  const activeRequestsByTalent = new Map<number, IMentoringRequest[]>();

  for (const request of requests) {
    if (!ACTIVE_STATUSES.includes(request.RequestStatus)) continue;
    const bucket = activeRequestsByTalent.get(request.TalentRef.Id) ?? [];
    bucket.push(request);
    activeRequestsByTalent.set(request.TalentRef.Id, bucket);
  }

  return talents
    .map(talent => {
      const activeRequests = (activeRequestsByTalent.get(talent.Id) ?? []).slice().sort((a, b) => b.Id - a.Id);
      const activeRequest = activeRequests[0];
      return createRow(talent, activeRequest, activeRequests.length > 1);
    })
    .sort((a, b) => {
      const statusDelta = getStatusRank(a) - getStatusRank(b);
      if (statusDelta !== 0) return statusDelta;
      return a.talent.Title.localeCompare(b.talent.Title, 'cs');
    });
}

function createRow(
  talent: ITalent,
  activeRequest: IMentoringRequest | undefined,
  hasMultipleActiveRequests: boolean
): IMenteeDashboardRow {
  if (!activeRequest) {
    return {
      talent,
      status: 'no_request',
      statusLabel: 'Bez žádosti',
      detailLabel: 'Talent zatím nemá aktivní mentoring request.',
      mentorLabel: '—',
      statusClassName: styles.statusCancelled,
      hasMultipleActiveRequests,
      searchText: `${talent.Title} ${talent.TalentUser.EMail}`.toLowerCase()
    };
  }

  if (activeRequest.RequestStatus === RequestStatus.Pending) {
    const currentMentor = getCurrentMentor(activeRequest);
    return {
      talent,
      activeRequest,
      status: 'pending',
      statusLabel: 'Čeká na mentora',
      detailLabel: `Aktivní stage ${activeRequest.CurrentStage} z ${getTotalStages(activeRequest)}.`,
      mentorLabel: currentMentor?.Title ?? '—',
      actionLabel: 'Schválit za mentora',
      statusClassName: styles.statusPending,
      hasMultipleActiveRequests,
      searchText: `${talent.Title} ${talent.TalentUser.EMail} ${currentMentor?.Title ?? ''}`.toLowerCase()
    };
  }

  if (activeRequest.RequestStatus === RequestStatus.HR_Review) {
    return {
      talent,
      activeRequest,
      status: 'hr_review',
      statusLabel: 'Vyžaduje HR',
      detailLabel: 'Všichni zvolení mentoři odmítli. Případ čeká na ruční řešení HR.',
      mentorLabel: listMentors(activeRequest) || '—',
      actionLabel: 'Naplánovat',
      statusClassName: styles.statusHR,
      hasMultipleActiveRequests,
      searchText: `${talent.Title} ${talent.TalentUser.EMail} ${listMentors(activeRequest)}`.toLowerCase()
    };
  }

  if (activeRequest.RequestStatus === RequestStatus.Approved) {
    const approvedMentor = getApprovedMentor(activeRequest);
    return {
      talent,
      activeRequest,
      status: 'approved',
      statusLabel: 'Mentor potvrzen',
      detailLabel: 'Mentor schválil pairing. HR zbývá mentoring naplánovat.',
      mentorLabel: approvedMentor?.Title ?? '—',
      actionLabel: 'Naplánovat',
      statusClassName: styles.statusApproved,
      hasMultipleActiveRequests,
      searchText: `${talent.Title} ${talent.TalentUser.EMail} ${approvedMentor?.Title ?? ''}`.toLowerCase()
    };
  }

  const scheduledMentor = getApprovedMentor(activeRequest);
  return {
    talent,
    activeRequest,
    status: 'scheduled',
    statusLabel: 'Propojeno',
    detailLabel: 'Mentoring je schválený a naplánovaný.',
    mentorLabel: scheduledMentor?.Title ?? '—',
    statusClassName: styles.statusScheduled,
    hasMultipleActiveRequests,
    searchText: `${talent.Title} ${talent.TalentUser.EMail} ${scheduledMentor?.Title ?? ''}`.toLowerCase()
  };
}

function matchesFilter(row: IMenteeDashboardRow, filter: DashboardFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'needsHr') return row.status === 'hr_review';
  if (filter === 'waiting') return row.status === 'pending';
  return row.hasMultipleActiveRequests;
}

function matchesSearch(row: IMenteeDashboardRow, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return row.searchText.includes(query);
}

function getCurrentMentor(request: IMentoringRequest): ISPLookup | undefined {
  if (request.CurrentStage === 1) return request.Mentor1Ref;
  if (request.CurrentStage === 2) return request.Mentor2Ref;
  if (request.CurrentStage === 3) return request.Mentor3Ref;
  return undefined;
}

function getApprovedMentor(request: IMentoringRequest): ISPLookup | undefined {
  if (request.Stage1Decision === StageDecision.Approved) return request.Mentor1Ref;
  if (request.Stage2Decision === StageDecision.Approved) return request.Mentor2Ref;
  if (request.Stage3Decision === StageDecision.Approved) return request.Mentor3Ref;
  return undefined;
}

function getTotalStages(request: IMentoringRequest): number {
  if (request.Mentor3Ref) return 3;
  if (request.Mentor2Ref) return 2;
  return 1;
}

function listMentors(request: IMentoringRequest): string {
  return [request.Mentor1Ref?.Title, request.Mentor2Ref?.Title, request.Mentor3Ref?.Title]
    .filter((value): value is string => Boolean(value))
    .join(', ');
}

function getStatusRank(row: IMenteeDashboardRow): number {
  if (!row.talent.IsActive) return 5;
  if (row.hasMultipleActiveRequests) return -1;
  if (row.status === 'hr_review') return 0;
  if (row.status === 'pending') return 1;
  if (row.status === 'approved') return 2;
  if (row.status === 'scheduled') return 3;
  return 4;
}

export default MenteesDashboard;

```

## `src/webparts/auresApp/components/hr/MentorManagement.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS } from '../../../../utils/mockData';

interface IMentorManagementProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

interface IMentorFormData {
  Title: string;
  JobTitle: string;
  Superpower: string;
  Bio: string;
  Capacity: number;
  PhotoUrl: string;
}

const emptyForm: IMentorFormData = {
  Title: '', JobTitle: '', Superpower: '', Bio: '', Capacity: 3, PhotoUrl: ''
};

const MentorManagement: React.FC<IMentorManagementProps> = ({ sp }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving]   = React.useState(false);

  // Add/Edit form
  const [showForm, setShowForm]     = React.useState(false);
  const [editingId, setEditingId]   = React.useState<number | null>(null);
  const [form, setForm]             = React.useState<IMentorFormData>(emptyForm);

  // Delete confirmation
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    new MentoringService(sp).getAllMentorsForAdmin()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS))
      .finally(() => setLoading(false));
  }, [sp]);

  const updateField = <K extends keyof IMentorFormData>(key: K, value: IMentorFormData[K]): void => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const openAddForm = (): void => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (mentor: IMentor): void => {
    setEditingId(mentor.Id);
    setForm({
      Title: mentor.Title,
      JobTitle: mentor.JobTitle,
      Superpower: mentor.Superpower,
      Bio: mentor.Bio,
      Capacity: mentor.Capacity,
      PhotoUrl: mentor.PhotoUrl ?? ''
    });
    setShowForm(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!form.Title.trim()) return;
    setSaving(true);
    const svc = new MentoringService(sp);
    try {
      if (editingId) {
        await svc.updateMentor(editingId, {
          Title: form.Title.trim(),
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        });
        setMentors(prev => prev.map(m => m.Id === editingId ? {
          ...m,
          Title: form.Title.trim(),
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        } : m));
      } else {
        const newId = await svc.addMentor({
          Title: form.Title.trim(),
          MentorUserId: 0, // HR priradi rucne v SP
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          PhotoUrl: form.PhotoUrl.trim()
        });
        setMentors(prev => [...prev, {
          Id: newId ?? prev.length + 100,
          Title: form.Title.trim(),
          MentorUser: { Id: 0, Title: form.Title.trim(), EMail: '' },
          JobTitle: form.JobTitle.trim(),
          Superpower: form.Superpower.trim(),
          Bio: form.Bio.trim(),
          Capacity: form.Capacity,
          AvailabilityNote: '',
          PhotoUrl: form.PhotoUrl.trim(),
          IsActive: true
        }]);
      }
    } catch { /* lokalni dev */ }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (mentorId: number): Promise<void> => {
    setSaving(true);
    try {
      await new MentoringService(sp).deleteMentor(mentorId);
    } catch { /* lokalni dev */ }
    setMentors(prev => prev.filter(m => m.Id !== mentorId));
    setDeletingId(null);
    setSaving(false);
  };

  const toggleActive = async (mentor: IMentor): Promise<void> => {
    try {
      await new MentoringService(sp).setMentorActive(mentor.Id, !mentor.IsActive);
    } catch { /* lokalni dev */ }
    setMentors(prev => prev.map(m => m.Id === mentor.Id ? { ...m, IsActive: !m.IsActive } : m));
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Správa mentorů ({mentors.length})</h2>
        <button className={styles.btnPrimary} onClick={openAddForm}>
          + Přidat mentora
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={styles.mentorFormCard}>
          <h3 className={styles.formSectionTitle}>
            {editingId ? 'Upravit mentora' : 'Nový mentor'}
          </h3>
          <div className={styles.mentorFormGrid}>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Jméno a příjmení</label>
              <input
                className={styles.formInput}
                value={form.Title}
                onChange={e => updateField('Title', e.target.value)}
                placeholder="Jan Novák"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Pozice</label>
              <input
                className={styles.formInput}
                value={form.JobTitle}
                onChange={e => updateField('JobTitle', e.target.value)}
                placeholder="CEO, CFO, VP Marketing…"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Superschopnost</label>
              <input
                className={styles.formInput}
                value={form.Superpower}
                onChange={e => updateField('Superpower', e.target.value)}
                placeholder="Strategické myšlení, leadership…"
              />
            </div>
            <div className={styles.mentorFormField}>
              <label className={styles.messageLabel}>Kapacita (počet talentů)</label>
              <input
                className={styles.formInput}
                type="number"
                min={0}
                max={20}
                value={form.Capacity}
                onChange={e => updateField('Capacity', Number(e.target.value))}
              />
            </div>
            <div className={styles.mentorFormFieldFull}>
              <label className={styles.messageLabel}>Bio</label>
              <textarea
                className={styles.messageTextarea}
                value={form.Bio}
                onChange={e => updateField('Bio', e.target.value)}
                placeholder="Krátký popis mentora…"
                rows={3}
              />
            </div>
            <div className={styles.mentorFormFieldFull}>
              <label className={styles.messageLabel}>URL fotky</label>
              <input
                className={styles.formInput}
                value={form.PhotoUrl}
                onChange={e => updateField('PhotoUrl', e.target.value)}
                placeholder="https://… (odkaz na fotografii v SharePointu)"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              className={styles.btnPrimary}
              disabled={saving || !form.Title.trim()}
              onClick={() => { void handleSave(); }}
            >
              {saving ? 'Ukládám…' : (editingId ? 'Uložit změny' : 'Vytvořit mentora')}
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => { setShowForm(false); setEditingId(null); }}
            >
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Mentor list */}
      <div className={styles.managementList}>
        {mentors.map(mentor => (
          <div
            key={mentor.Id}
            className={[styles.managementRow, !mentor.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
          >
            <div className={styles.managementInfo}>
              <p className={styles.managementName}>{mentor.Title}</p>
              <p className={styles.managementMeta}>
                {mentor.JobTitle} · {mentor.Superpower}
              </p>
            </div>

            <span className={styles.managementCapacityLabel}>
              Kapacita: {mentor.Capacity}
            </span>

            <button
              className={mentor.IsActive ? styles.activeBtn : styles.inactiveBtn}
              onClick={() => { void toggleActive(mentor); }}
            >
              {mentor.IsActive ? 'Aktivní' : 'Neaktivní'}
            </button>

            <button
              className={styles.hrActionBtn}
              onClick={() => openEditForm(mentor)}
              title="Upravit"
            >
              Upravit
            </button>

            {deletingId === mentor.Id ? (
              <div className={styles.deleteConfirm}>
                <span className={styles.deleteConfirmText}>Smazat?</span>
                <button
                  className={styles.hrActionBtnDanger}
                  disabled={saving}
                  onClick={() => { void handleDelete(mentor.Id); }}
                >
                  Ano
                </button>
                <button
                  className={styles.hrActionBtn}
                  onClick={() => setDeletingId(null)}
                >
                  Ne
                </button>
              </div>
            ) : (
              <button
                className={styles.hrActionBtnDanger}
                onClick={() => setDeletingId(mentor.Id)}
                title="Smazat mentora"
              >
                Smazat
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorManagement;

```

## `src/webparts/auresApp/components/hr/TalentManagement.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ITalent, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_TALENTS } from '../../../../utils/mockData';

interface ITalentManagementProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const TalentManagement: React.FC<ITalentManagementProps> = ({ sp }) => {
  const [talents, setTalents] = React.useState<ITalent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getAllTalentsForAdmin()
      .then(setTalents)
      .catch(() => setTalents(MOCK_TALENTS))
      .finally(() => setLoading(false));
  }, [sp]);

  const toggleActive = async (talent: ITalent): Promise<void> => {
    try {
      await new MentoringService(sp).setTalentActive(talent.Id, !talent.IsActive);
    } catch {
      // lokalni dev — ignoruj
    }
    setTalents(prev => prev.map(t => t.Id === talent.Id ? { ...t, IsActive: !t.IsActive } : t));
  };

  if (loading) return <div className={styles.loading}>Načítám talenty…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Správa talentů ({talents.length})</h2>
      <div className={styles.managementList}>
        {talents.map(talent => (
          <div
            key={talent.Id}
            className={[styles.managementRow, !talent.IsActive ? styles.managementRowInactive : ''].filter(Boolean).join(' ')}
          >
            <div className={styles.managementInfo}>
              <p className={styles.managementName}>{talent.Title}</p>
            </div>
            <button
              className={talent.IsActive ? styles.activeBtn : styles.inactiveBtn}
              onClick={() => { void toggleActive(talent); }}
            >
              {talent.IsActive ? 'Aktivní' : 'Neaktivní'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentManagement;

```

## `src/webparts/auresApp/components/mentor/PendingRequests.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IPendingRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MOCK_MENTOR_ID = 1; // Jan Novak — fallback pro lokalni dev

const PendingRequests: React.FC<IPendingRequestsProps> = ({ sp, currentUser, navigate }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const mentorId = currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID;

    const mockFallback = MOCK_REQUESTS.filter(r =>
      r.RequestStatus === RequestStatus.Pending && (
        (r.Mentor1Ref?.Id === mentorId && r.CurrentStage === 1) ||
        (r.Mentor2Ref?.Id === mentorId && r.CurrentStage === 2) ||
        (r.Mentor3Ref?.Id === mentorId && r.CurrentStage === 3)
      )
    );

    new MentoringService(sp).getPendingRequestsForMentor(mentorId)
      .then(setRequests)
      .catch(() => setRequests(mockFallback))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Čekající žádosti</h2>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Momentálně na tebe nečeká žádná žádost.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => (
            <PendingRow
              key={req.Id}
              request={req}
              mentorId={currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID}
              onClick={() => navigate('RequestDetail', { requestId: req.Id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// PendingRow — jeden radek cekajici zadosti
// ----------------------------------------------------------------

interface IPendingRowProps {
  request: IMentoringRequest;
  mentorId: number;
  onClick: () => void;
}

const PendingRow: React.FC<IPendingRowProps> = ({ request, mentorId, onClick }) => {
  const stage = resolveMyStage(request, mentorId);
  const message = stage === 1 ? request.Message1 : stage === 2 ? request.Message2 : request.Message3;
  const preview = message ? message.slice(0, 120) + (message.length > 120 ? '...' : '') : '';

  return (
    <div className={styles.pendingRow} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.pendingRowLeft}>
        <div className={styles.pendingRowHeader}>
          <span className={styles.requestTitle}>{request.Title}</span>
          <span className={styles.stageIndicator}>Mentor #{stage}</span>
        </div>
        <p className={styles.talentName}>{request.TalentRef.Title}</p>
        {preview && <p className={styles.messagePreview}>{preview}</p>}
      </div>
      <span className={styles.arrowIcon}>›</span>
    </div>
  );
};

function resolveMyStage(req: IMentoringRequest, mentorId: number): 1 | 2 | 3 {
  if (req.Mentor2Ref?.Id === mentorId && req.CurrentStage === 2) return 2;
  if (req.Mentor3Ref?.Id === mentorId && req.CurrentStage === 3) return 3;
  return 1;
}

export default PendingRequests;

```

## `src/webparts/auresApp/components/mentor/RequestDetail.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, StageDecision, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IRequestDetailProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  requestId: number | undefined;
  hrEmail: string;
}

const MOCK_MENTOR_ID = 1;

const RequestDetail: React.FC<IRequestDetailProps> = ({ sp, currentUser, navigate, requestId, hrEmail }) => {
  const [request, setRequest]   = React.useState<IMentoringRequest | null>(null);
  const [loading, setLoading]   = React.useState(true);
  const [deciding, setDeciding] = React.useState(false);
  const [decisionDone, setDecisionDone] = React.useState(false);

  React.useEffect(() => {
    if (!requestId) {
      navigate('PendingRequests');
      return;
    }
    new MentoringService(sp).getRequestById(requestId)
      .then(setRequest)
      .catch(() => {
        const mock = MOCK_REQUESTS.find(r => r.Id === requestId);
        if (mock) setRequest(mock);
        else navigate('PendingRequests');
      })
      .finally(() => setLoading(false));
  }, [sp, requestId]);

  const handleDecision = async (decision: StageDecision): Promise<void> => {
    if (!request || !myStage) return;
    setDeciding(true);
    try {
      await new MentoringService(sp).makeDecision(
        request.Id,
        myStage,
        decision,
        currentUser.id
      );
    } catch {
      // V lokalni dev nepripojene SP — simulujeme uspech
    }
    // 6.2 / 6.3 — notifikace (best-effort, neblokovani UX)
    void sendDecisionNotification(sp, decision, request, myStage, currentUser, hrEmail);
    setDecisionDone(true);
    setDeciding(false);
    setTimeout(() => navigate('PendingRequests'), 1200);
  };

  if (loading) return <div className={styles.loading}>Načítám detail žádosti…</div>;
  if (!request)  return <div className={styles.loading}>Žádost nenalezena.</div>;

  const mentorId = currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID;
  const myStage  = resolveActiveStage(request, mentorId);

  if (!myStage) {
    return (
      <div className={styles.requestDetailCard}>
        <p>Tato žádost momentálně nevyžaduje tvoje rozhodnutí (není ve tvé fázi, nebo už byla vyřešena).</p>
        <button className={styles.btnSecondary} onClick={() => navigate('PendingRequests')}>Zpět</button>
      </div>
    );
  }

  const myMessage = myStage === 1 ? request.Message1
    : myStage === 2 ? request.Message2
    : request.Message3;

  const nextMentorHint = resolveNextMentorHint(request, myStage);

  return (
    <div>
      {/* Zpet */}
      <button className={styles.btnBack} onClick={() => navigate('PendingRequests')}>
        ‹ Zpět na seznam
      </button>

      <h2 className={styles.pageTitle}>{request.Title}</h2>

      <div className={styles.requestDetailCard}>

        {/* Talent */}
        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Talent</p>
          <p className={styles.detailValue}>{request.TalentRef.Title}</p>
        </div>

        {/* Stage indikator */}
        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Tvoje pozice v řetězu</p>
          <span className={styles.stageIndicator}>Mentor #{myStage}</span>
        </div>

        {/* Zprava od talentu */}
        <div className={styles.detailSection}>
          <p className={styles.detailLabel}>Zpráva od talentu</p>
          <div className={styles.talentMessage}>
            {myMessage ?? '(žádná zpráva)'}
          </div>
        </div>

        {/* Rozhodnuti */}
        {decisionDone ? (
          <div className={styles.decisionConfirm}>
            Rozhodnutí uloženo. Přesměrovávám…
          </div>
        ) : (
          <div className={styles.detailSection}>
            <p className={styles.detailLabel}>Tvoje rozhodnutí</p>
            <div className={styles.decisionBtns}>
              <button
                className={styles.btnApprove}
                disabled={deciding}
                onClick={() => { void handleDecision(StageDecision.Approved); }}
              >
                Schválit
              </button>
              <button
                className={styles.btnReject}
                disabled={deciding}
                onClick={() => { void handleDecision(StageDecision.Rejected); }}
              >
                Zamítnout
              </button>
            </div>
            {nextMentorHint && (
              <p className={styles.rejectHint}>{nextMentorHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function resolveActiveStage(req: IMentoringRequest, mentorId: number): 1 | 2 | 3 | null {
  if (req.RequestStatus !== RequestStatus.Pending) return null;
  if (req.CurrentStage === 1 && req.Mentor1Ref?.Id === mentorId) return 1;
  if (req.CurrentStage === 2 && req.Mentor2Ref?.Id === mentorId) return 2;
  if (req.CurrentStage === 3 && req.Mentor3Ref?.Id === mentorId) return 3;
  return null;
}

function resolveNextMentorHint(req: IMentoringRequest, myStage: 1 | 2 | 3): string {
  if (myStage === 1 && req.Mentor2Ref) return `Při zamítnutí: žádost bude předána ${req.Mentor2Ref.Title}.`;
  if (myStage === 2 && req.Mentor3Ref) return `Při zamítnutí: žádost bude předána ${req.Mentor3Ref.Title}.`;
  return 'Při zamítnutí: žádost bude předána na HR review.';
}

// ----------------------------------------------------------------
// 6.2 / 6.3 — Odeslani notifikaci po rozhodnuti (best-effort)
// ----------------------------------------------------------------
async function sendDecisionNotification(
  sp: SPFI,
  decision: StageDecision,
  request: IMentoringRequest,
  myStage: 1 | 2 | 3,
  currentUser: ICurrentUser,
  hrEmail: string
): Promise<void> {
  try {
    const svc = new MentoringService(sp);
    const ns  = new NotificationService();
    const talent = await svc.getTalentById(request.TalentRef.Id);

    if (decision === StageDecision.Approved) {
      // 6.3 — schvaleno: notifikuj pouze HR
      if (currentUser.mentorRecord) {
        await ns.notifyOnApproval(hrEmail, talent, currentUser.mentorRecord, request.Id, request.Title);
      }
    } else {
      // Pri zamitnuti uz system neposila notifikace mentorum ani talentum.
      // HR se notifikuje jen pokud zadost eskaluje do HR Review.
      const nextRef = myStage === 1 ? request.Mentor2Ref
                    : myStage === 2 ? request.Mentor3Ref
                    : undefined;
      if (!nextRef) {
        await ns.notifyHROnEscalation(hrEmail, talent, request.Id, request.Title);
      }
    }
  } catch {
    // notifikace je best-effort — chyba nesmi shoditi UI
  }
}

export default RequestDetail;

```

## `src/webparts/auresApp/components/mentor/RequestHistory.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, StageDecision } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IRequestHistoryProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MOCK_MENTOR_ID = 1; // Jan Novak — fallback pro lokalni dev

const RequestHistory: React.FC<IRequestHistoryProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const mentorId = currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID;

    // Fallback: zadosti kde mentor rozhodoval (ma zaznam Stage*DecisionBy nebo je v MentorXRef)
    const mockFallback = MOCK_REQUESTS.filter(r =>
      (r.Mentor1Ref?.Id === mentorId && r.Stage1Decision != null) ||
      (r.Mentor2Ref?.Id === mentorId && r.Stage2Decision != null) ||
      (r.Mentor3Ref?.Id === mentorId && r.Stage3Decision != null)
    );

    new MentoringService(sp).getRequestHistoryForMentor(mentorId)
      .then(setRequests)
      .catch(() => setRequests(mockFallback))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  if (loading) return <div className={styles.loading}>Načítám historii…</div>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Moje rozhodnuti</h2>

      {requests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Zatím jsi nerozhodoval žádné žádosti.</p>
        </div>
      ) : (
        <div className={styles.requestList}>
          {requests.map(req => (
            <HistoryRow
              key={req.Id}
              request={req}
              mentorId={currentUser.mentorRecord?.Id ?? MOCK_MENTOR_ID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// HistoryRow — jeden zaznam v historii rozhodnuti
// ----------------------------------------------------------------

interface IHistoryRowProps {
  request: IMentoringRequest;
  mentorId: number;
}

const HistoryRow: React.FC<IHistoryRowProps> = ({ request, mentorId }) => {
  const myDecision = resolveMyDecision(request, mentorId);
  const decisionDate = myDecision ? formatDate(getDecisionDate(request, myDecision.stage)) : '';

  return (
    <div className={styles.historyCard}>
      <div className={styles.historyLeft}>
        <p className={styles.historyTitle}>
          {request.Title} — {request.TalentRef.Title}
        </p>
        <p className={styles.historyMeta}>
          Mentor #{myDecision?.stage ?? '?'}{decisionDate ? ` · ${decisionDate}` : ''}
        </p>
      </div>
      {myDecision && (
        <span className={[
          styles.decisionBadge,
          myDecision.decision === StageDecision.Approved ? styles.decisionApproved : styles.decisionRejected
        ].join(' ')}>
          {myDecision.decision === StageDecision.Approved ? 'Schváleno' : 'Zamítnuto'}
        </span>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function resolveMyDecision(
  req: IMentoringRequest,
  mentorId: number
): { stage: 1 | 2 | 3; decision: StageDecision } | undefined {
  if (req.Mentor1Ref?.Id === mentorId && req.Stage1Decision != null)
    return { stage: 1, decision: req.Stage1Decision };
  if (req.Mentor2Ref?.Id === mentorId && req.Stage2Decision != null)
    return { stage: 2, decision: req.Stage2Decision };
  if (req.Mentor3Ref?.Id === mentorId && req.Stage3Decision != null)
    return { stage: 3, decision: req.Stage3Decision };
  return undefined;
}

function getDecisionDate(req: IMentoringRequest, stage: 1 | 2 | 3): string | undefined {
  if (stage === 1) return req.Stage1DecisionDate;
  if (stage === 2) return req.Stage2DecisionDate;
  return req.Stage3DecisionDate;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default RequestHistory;

```

## `src/webparts/auresApp/components/talent/MentorCatalog.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS } from '../../../../utils/mockData';

interface IMentorCatalogProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MentorCatalog: React.FC<IMentorCatalogProps> = ({ sp, navigate }) => {
  const [mentors, setMentors] = React.useState<IMentor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    new MentoringService(sp).getMentors()
      .then(setMentors)
      .catch(() => setMentors(MOCK_MENTORS.filter(m => m.IsActive)))
      .finally(() => setLoading(false));
  }, [sp]);

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  if (!mentors.length) {
    return (
      <div className={styles.emptyState}>
        <p>Momentálně nejsou k dispozici žádní aktivní mentoři.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Katalog mentorů</h2>
      <div className={styles.mentorGrid}>
        {mentors.map(mentor => (
          <MentorCard
            key={mentor.Id}
            mentor={mentor}
            onRequest={() => navigate('RequestForm', { preselectedMentorId: mentor.Id })}
          />
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// MentorCard
// ----------------------------------------------------------------

interface IMentorCardProps {
  mentor: IMentor;
  onRequest: () => void;
}

const MentorCard: React.FC<IMentorCardProps> = ({ mentor, onRequest }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Split bio on "\n\nNejvětší překonaná výzva:" to separate bio and challenge
  const bioChallengeSplit = mentor.Bio.split('\n\nNejvětší překonaná výzva:');
  const bioText = bioChallengeSplit[0];
  const challengeText = bioChallengeSplit.length > 1 ? bioChallengeSplit[1].trim() : '';

  // Short bio: first ~2 sentences
  const shortBio = bioText.split(/(?<=\.)\s+/).slice(0, 2).join(' ');
  const hasMore = bioText.length > shortBio.length || challengeText.length > 0;

  const avatarClass = mentor.PhotoUrl
    ? `${styles.mentorAvatar} ${styles.mentorAvatarPhoto}`
    : styles.mentorAvatar;
  const avatarStyle = mentor.PhotoUrl
    ? { backgroundImage: `url('${mentor.PhotoUrl}')` }
    : undefined;

  return (
    <div className={styles.mentorCard}>
      <div className={styles.mentorCardHeader}>
        <div className={avatarClass} style={avatarStyle}>
          {!mentor.PhotoUrl && getInitials(mentor.Title)}
        </div>
        <div>
          <p className={styles.mentorName}>{mentor.Title}</p>
          <p className={styles.mentorJobTitle}>{mentor.JobTitle}</p>
        </div>
      </div>

      <p className={styles.mentorSuperpower}>{mentor.Superpower}</p>
      <p className={styles.mentorBio}>{shortBio}</p>

      {hasMore && (
        <div className={styles.mentorDetails}>
          {expanded && (
            <div className={styles.mentorDetailsContent}>
              <p>{bioText.slice(shortBio.length).trim()}</p>
              {challengeText && (
                <div className={styles.mentorChallenge}>
                  <strong>Největší překonaná výzva:</strong> {challengeText}
                </div>
              )}
            </div>
          )}
          <button
            className={styles.mentorDetailsToggle}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Sbalit profil' : 'Zobrazit celý profil'}
          </button>
        </div>
      )}

      <div className={styles.mentorCardActions}>
        <button className={styles.btnPrimary} onClick={onRequest} style={{ width: '100%' }}>
          Požádat o mentoring
        </button>
      </div>
    </div>
  );
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default MentorCatalog;

```

## `src/webparts/auresApp/components/talent/MyRequests.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentoringRequest, ICurrentUser, RequestStatus, StageDecision, ISPLookup } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';
import { MOCK_REQUESTS } from '../../../../utils/mockData';

interface IMyRequestsProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
}

const MyRequests: React.FC<IMyRequestsProps> = ({ sp, currentUser }) => {
  const [requests, setRequests] = React.useState<IMentoringRequest[]>([]);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) {
      setRequests(MOCK_REQUESTS.filter(r => r.TalentRef.Id === 1));
      setLoading(false);
      return;
    }
    new MentoringService(sp).getMyRequests(talentId)
      .then(setRequests)
      .catch(() => setRequests(MOCK_REQUESTS.filter(r => r.TalentRef.Id === talentId)))
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  if (loading) return <div className={styles.loading}>Načítám žádosti…</div>;

  if (requests.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Zatím nemáš žádné žádosti o mentoring.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Moje žádosti</h2>
      <div className={styles.requestList}>
        {requests.map(req => <RequestCard key={req.Id} request={req} />)}
      </div>
    </div>
  );
};

interface IRequestCardProps { request: IMentoringRequest; }

const RequestCard: React.FC<IRequestCardProps> = ({ request }) => {
  const stages: { mentor: ISPLookup; stage: 1 | 2 | 3 }[] = (
    [
      { mentor: request.Mentor1Ref, stage: 1 as const },
      { mentor: request.Mentor2Ref, stage: 2 as const },
      { mentor: request.Mentor3Ref, stage: 3 as const }
    ] as { mentor: ISPLookup | undefined; stage: 1 | 2 | 3 }[]
  ).filter((s): s is { mentor: ISPLookup; stage: 1 | 2 | 3 } => s.mentor != null);

  const getDecision = (stage: 1 | 2 | 3): StageDecision | undefined => {
    if (stage === 1) return request.Stage1Decision;
    if (stage === 2) return request.Stage2Decision;
    return request.Stage3Decision;
  };

  const getMentorStatus = (stage: 1 | 2 | 3): { label: string; className: string } => {
    const decision = getDecision(stage);

    if (request.RequestStatus === RequestStatus.Approved && decision === StageDecision.Approved) {
      return { label: 'Schváleno', className: styles.statusApproved };
    }
    if (decision === StageDecision.Rejected) {
      return { label: 'Zamítnuto', className: styles.statusCancelled };
    }
    if (request.CurrentStage === stage && request.RequestStatus === RequestStatus.Pending) {
      return { label: 'Čeká na schválení', className: styles.statusPending };
    }
    if (stage > request.CurrentStage && request.RequestStatus === RequestStatus.Pending) {
      return { label: 'Ve frontě', className: styles.statusQueued };
    }
    if (request.RequestStatus === RequestStatus.HR_Review) {
      return { label: 'Předáno na HR', className: styles.statusHR };
    }
    if (request.RequestStatus === RequestStatus.Scheduled) {
      return { label: 'Naplánováno', className: styles.statusScheduled };
    }
    if (request.RequestStatus === RequestStatus.Cancelled) {
      return { label: 'Zrušeno', className: styles.statusCancelled };
    }
    return { label: 'Čeká', className: styles.statusPending };
  };

  return (
    <div className={styles.requestCard}>
      {stages.map(({ mentor, stage }) => {
        const status = getMentorStatus(stage);
        return (
          <div key={stage} className={styles.myRequestMentorRow}>
            <span className={styles.myRequestMentorName}>
              Mentoring od {mentor.Title}
            </span>
            <span className={[styles.statusBadge, status.className].join(' ')}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MyRequests;

```

## `src/webparts/auresApp/components/talent/RequestForm.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { IMentor, ICurrentUser, RequestStatus } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NotificationService } from '../../../../services/NotificationService';
import { NavigateFn } from '../AppView';
import { MOCK_MENTORS, MOCK_REQUESTS } from '../../../../utils/mockData';

interface IRequestFormProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  hrEmail: string;
  preselectedMentorId?: number;
}

const RequestForm: React.FC<IRequestFormProps> = ({ sp, currentUser, navigate, hrEmail, preselectedMentorId }) => {
  const [mentors, setMentors]       = React.useState<IMentor[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [submitting, setSubmitting]       = React.useState(false);
  const [error, setError]                 = React.useState<string | null>(null);
  const [hasActiveRequest, setHasActiveRequest] = React.useState(false);

  const [secondaryId, setSecondaryId] = React.useState<number | null>(null);
  const [tertiaryId, setTertiaryId]   = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    const talentId = currentUser.talentRecord?.Id;
    const svc = new MentoringService(sp);
    Promise.all([
      svc.getMentors(),
      talentId ? svc.getMyRequests(talentId) : Promise.resolve([])
    ])
      .then(([mentorsData, myReqs]) => {
        setMentors(mentorsData);
        const active = myReqs.some(r =>
          ([RequestStatus.Pending, RequestStatus.Approved, RequestStatus.HR_Review, RequestStatus.Scheduled] as string[]).includes(r.RequestStatus)
        );
        setHasActiveRequest(active);
      })
      .catch(() => {
        setMentors(MOCK_MENTORS.filter(m => m.IsActive));
        const active = MOCK_REQUESTS.some(r =>
          r.TalentRef?.Id === talentId &&
          ([RequestStatus.Pending, RequestStatus.Approved, RequestStatus.HR_Review, RequestStatus.Scheduled] as string[]).includes(r.RequestStatus)
        );
        setHasActiveRequest(active);
      })
      .finally(() => setLoading(false));
  }, [sp, currentUser]);

  const setMessage = (mentorId: number, msg: string): void => {
    setMessages(prev => ({ ...prev, [mentorId]: msg }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!preselectedMentorId) {
      setError('Nebyl zvolen primární mentor.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const talentId = currentUser.talentRecord?.Id ?? 0;
      const mentorIds: [number, number?, number?] = [
        preselectedMentorId,
        secondaryId ?? undefined,
        tertiaryId ?? undefined
      ];
      const msgs: [string, string?, string?] = [
        (messages[preselectedMentorId] ?? '').trim(),
        secondaryId != null ? (messages[secondaryId] ?? '').trim() : undefined,
        tertiaryId != null ? (messages[tertiaryId] ?? '').trim() : undefined
      ];
      const newId = await new MentoringService(sp).submitRequest(talentId, mentorIds, msgs);
      void (async () => {
        try {
          const mentor1 = mentors.find(m => m.Id === preselectedMentorId);
          if (mentor1 && currentUser.talentRecord) {
            await new NotificationService().notifyHROnSubmit(
              hrEmail, currentUser.talentRecord, mentor1, newId, `REQ-2026-${newId}`
            );
          }
        } catch { /* best-effort */ }
      })();
      navigate('MyRequests');
    } catch {
      setError('Nepodařilo se odeslat žádost. Zkus to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Načítám mentory…</div>;

  if (hasActiveRequest) {
    return (
      <div className={styles.emptyState}>
        <p>Již máš aktivní žádost o mentoring. Pokud chceš podat novou, musíš svou volbu nejprve resetovat.</p>
        <button className={styles.btnPrimary} onClick={() => navigate('MyRequests')}>Přejít na Moje žádosti</button>
      </div>
    );
  }

  const primaryMentor = mentors.find(m => m.Id === preselectedMentorId);
  const otherMentors = mentors.filter(m => m.Id !== preselectedMentorId);

  if (!primaryMentor) {
    return (
      <div className={styles.emptyState}>
        <p>Mentor nebyl nalezen.</p>
        <button className={styles.btnPrimary} onClick={() => navigate('MentorCatalog')}>
          Zpět na katalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.requestForm}>
      <h2 className={styles.pageTitle}>Nová žádost o mentoring</h2>

      {/* 1. Primary Mentor — prominent */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Tvůj vybraný mentor</h3>
        <div className={styles.primaryMentorCard}>
          <div className={styles.primaryMentorHeader}>
            <div className={styles.primaryMentorAvatar}>{getInitials(primaryMentor.Title)}</div>
            <div className={styles.primaryMentorInfo}>
              <p className={styles.primaryMentorName}>{primaryMentor.Title}</p>
              <p className={styles.primaryMentorJobTitle}>{primaryMentor.JobTitle}</p>
              <p className={styles.primaryMentorSuperpower}>{primaryMentor.Superpower}</p>
            </div>
            <span className={styles.primaryMentorBadge}>Primární mentor</span>
          </div>
          <p className={styles.primaryMentorBio}>{primaryMentor.Bio}</p>
        </div>
      </div>

      {/* 2. Backup mentors */}
      {otherMentors.length > 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Záložní mentoři</h3>
          <p className={styles.formSectionHint}>
            Pokud vybraný mentor nebude mít kapacitu, systém automaticky osloví záložního mentora.
            Vyber si sekundárního a případně terciálního mentora.
          </p>
          <div className={styles.backupMentorList}>
            {otherMentors.map(mentor => {
              const isSecondary = secondaryId === mentor.Id;
              const isTertiary = tertiaryId === mentor.Id;
              const isSelected = isSecondary || isTertiary;

              return (
                <div
                  key={mentor.Id}
                  className={[
                    styles.backupMentorRow,
                    isSelected ? styles.backupMentorRowSelected : ''
                  ].filter(Boolean).join(' ')}
                >
                  <div className={styles.backupMentorInfo}>
                    <div className={styles.mentorAvatar}>{getInitials(mentor.Title)}</div>
                    <div>
                      <p className={styles.mentorSelectName}>{mentor.Title}</p>
                      <p className={styles.mentorSelectJobTitle}>
                        {mentor.JobTitle} · {mentor.Superpower}
                      </p>
                    </div>
                  </div>
                  <div className={styles.backupMentorActions}>
                    {isSecondary && <span className={styles.backupMentorLabel}>Sekundární</span>}
                    {isTertiary && <span className={styles.backupMentorLabelTertiary}>Terciální</span>}
                    {isSelected ? (
                      <button
                        className={styles.btnSecondary}
                        onClick={() => {
                          if (isSecondary) { setSecondaryId(tertiaryId); setTertiaryId(null); }
                          else { setTertiaryId(null); }
                        }}
                      >
                        Odebrat
                      </button>
                    ) : (
                      <button
                        className={styles.btnSecondary}
                        disabled={secondaryId !== null && tertiaryId !== null}
                        onClick={() => {
                          if (secondaryId === null) setSecondaryId(mentor.Id);
                          else if (tertiaryId === null) setTertiaryId(mentor.Id);
                        }}
                      >
                        {secondaryId === null ? 'Zvolit jako sekundárního' : 'Zvolit jako terciálního'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Optional messages */}
      <div className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Zprávy mentorům</h3>
        <p className={styles.formSectionHint}>
          Pokud chceš, můžeš mentorovi napsat zprávu — proč máš o něj zájem,
          co od mentoringu očekáváš, nebo cokoliv dalšího. Zpráva není povinná.
        </p>

        <div className={styles.messageGroup}>
          <label className={styles.messageLabel}>
            Zpráva pro {primaryMentor.Title} (primární)
          </label>
          <textarea
            className={styles.messageTextarea}
            value={messages[primaryMentor.Id] ?? ''}
            onChange={e => setMessage(primaryMentor.Id, e.target.value)}
            placeholder={`Napiš, proč tě zajímá mentoring od ${primaryMentor.Title}…`}
            rows={3}
          />
        </div>

        {secondaryId != null && (() => {
          const m = mentors.find(x => x.Id === secondaryId);
          return m ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {m.Title} (sekundární)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[secondaryId] ?? ''}
                onChange={e => setMessage(secondaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${m.Title}…`}
                rows={3}
              />
            </div>
          ) : null;
        })()}

        {tertiaryId != null && (() => {
          const m = mentors.find(x => x.Id === tertiaryId);
          return m ? (
            <div className={styles.messageGroup}>
              <label className={styles.messageLabel}>
                Zpráva pro {m.Title} (terciální)
              </label>
              <textarea
                className={styles.messageTextarea}
                value={messages[tertiaryId] ?? ''}
                onChange={e => setMessage(tertiaryId, e.target.value)}
                placeholder={`Napiš, proč tě zajímá mentoring od ${m.Title}…`}
                rows={3}
              />
            </div>
          ) : null;
        })()}
      </div>

      {/* 4. Actions */}
      <div className={styles.formActions}>
        <button
          className={styles.btnPrimary}
          onClick={() => { void handleSubmit(); }}
          disabled={submitting}
        >
          {submitting ? 'Odesílám…' : 'Odeslat žádost'}
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('MentorCatalog')}
          disabled={submitting}
        >
          Zpět na katalog
        </button>
        {error && <span className={styles.formError}>{error}</span>}
      </div>
    </div>
  );
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default RequestForm;

```

## `src/webparts/auresApp/components/talent/ResetChoice.tsx`

```tsx
import * as React from 'react';
import styles from '../AuresApp.module.scss';
import { SPFI } from '@pnp/sp';
import { ICurrentUser } from '../../../../services/interfaces';
import { MentoringService } from '../../../../services/MentoringService';
import { NavigateFn } from '../AppView';

interface IResetChoiceProps {
  sp: SPFI;
  currentUser: ICurrentUser;
  navigate: NavigateFn;
  onRequestsChanged: () => void;
}

const ResetChoice: React.FC<IResetChoiceProps> = ({ sp, currentUser, navigate, onRequestsChanged }) => {
  const [resetting, setResetting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleReset = async (): Promise<void> => {
    const talentId = currentUser.talentRecord?.Id;
    if (!talentId) return;

    setResetting(true);
    try {
      await new MentoringService(sp).cancelAllRequestsForTalent(talentId);
    } catch {
      // lokalni dev — ignoruj
    }
    setDone(true);
    setResetting(false);
    onRequestsChanged();
  };

  if (done) {
    return (
      <div className={styles.emptyState}>
        <p>Tvoje volba byla resetována. Můžeš si znovu vybrat mentora z katalogu.</p>
        <button
          className={styles.btnPrimary}
          style={{ marginTop: 16 }}
          onClick={() => navigate('MentorCatalog')}
        >
          Přejít na katalog mentorů
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Změna volby mentora</h2>
      <div className={styles.resetChoiceCard}>
        <p className={styles.resetChoiceText}>
          Pokud chceš změnit svou volbu mentora, můžeš zde zrušit všechny aktuální žádosti
          a začít výběr od začátku. Systém zruší všechny tvoje aktivní žádosti
          a budeš si moci znovu vybrat mentora z katalogu.
        </p>
        <p className={styles.resetChoiceWarning}>
          Tato akce je nevratná — všechny tvoje aktuální žádosti budou zrušeny.
        </p>
        <button
          className={styles.btnReject}
          onClick={() => { void handleReset(); }}
          disabled={resetting}
        >
          {resetting ? 'Ruším žádosti…' : 'Resetovat volbu a začít znovu'}
        </button>
      </div>
    </div>
  );
};

export default ResetChoice;

```

## `src/webparts/auresApp/loc/en-us.js`

```js
define([], function() {
  return {
    "PropertyPaneDescription": "Description",
    "BasicGroupName": "Group Name",
    "DescriptionFieldLabel": "Description Field"
  }
});
```

## `src/webparts/auresApp/loc/mystrings.d.ts`

```ts
declare interface IAuresAppWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'AuresAppWebPartStrings' {
  const strings: IAuresAppWebPartStrings;
  export = strings;
}

```

