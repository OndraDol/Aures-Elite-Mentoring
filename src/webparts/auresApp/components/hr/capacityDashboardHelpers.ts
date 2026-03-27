import { IMentoringRequest, RequestStatus, StageDecision } from '../../../../services/interfaces';

const CAPACITY_REQUEST_STATUSES = new Set<RequestStatus>([
  RequestStatus.Approved,
  RequestStatus.Scheduled
]);

export function countCapacityRequests(mentorId: number, requests: IMentoringRequest[]): number {
  return requests.filter(request =>
    CAPACITY_REQUEST_STATUSES.has(request.RequestStatus) && (
      (request.Mentor1Ref?.Id === mentorId && request.Stage1Decision === StageDecision.Approved) ||
      (request.Mentor2Ref?.Id === mentorId && request.Stage2Decision === StageDecision.Approved) ||
      (request.Mentor3Ref?.Id === mentorId && request.Stage3Decision === StageDecision.Approved)
    )
  ).length;
}
