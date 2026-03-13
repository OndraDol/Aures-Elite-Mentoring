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
                      <p className={styles.managementMeta}>{row.talent.TalentUser.EMail}</p>
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
