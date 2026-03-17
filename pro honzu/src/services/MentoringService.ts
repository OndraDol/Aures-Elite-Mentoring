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
