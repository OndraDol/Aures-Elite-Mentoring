import { countCapacityRequests } from './capacityDashboardHelpers';
import { RequestStatus, StageDecision, IMentoringRequest } from '../../../../services/interfaces';

describe('countCapacityRequests', () => {
  it('counts approved and scheduled requests for the same mentor', () => {
    const mentorId = 12;

    const requests: IMentoringRequest[] = [
      {
        Id: 1,
        Title: 'Approved request',
        TalentRef: { Id: 101, Title: 'Talent One' },
        Mentor1Ref: { Id: mentorId, Title: 'Mentor One' },
        CurrentStage: 1,
        RequestStatus: RequestStatus.Approved,
        Stage1Decision: StageDecision.Approved
      },
      {
        Id: 2,
        Title: 'Scheduled request',
        TalentRef: { Id: 102, Title: 'Talent Two' },
        Mentor1Ref: { Id: mentorId, Title: 'Mentor One' },
        CurrentStage: 1,
        RequestStatus: RequestStatus.Scheduled,
        Stage1Decision: StageDecision.Approved
      }
    ];

    expect(countCapacityRequests(mentorId, requests)).toBe(2);
  });
});
