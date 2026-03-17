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
  PhotoUrl?: string;
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
