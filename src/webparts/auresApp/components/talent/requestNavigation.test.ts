import { completeRequestReset, completeRequestSubmission } from './requestNavigation';

describe('completeRequestSubmission', () => {
  it('refreshes talent navigation state before moving to MyRequests', async () => {
    const events: string[] = [];
    let releaseRefresh: (() => void) | undefined;

    const onRequestsChanged = jest.fn(() => new Promise<void>(resolve => {
      events.push('refresh-start');
      releaseRefresh = () => {
        events.push('refresh-end');
        resolve();
      };
    }));
    const navigate = jest.fn((view: string) => {
      events.push(`navigate:${view}`);
    });

    const flow = completeRequestSubmission(onRequestsChanged, navigate);

    expect(events).toEqual(['refresh-start']);

    releaseRefresh?.();
    await flow;

    expect(events).toEqual(['refresh-start', 'refresh-end', 'navigate:MyRequests']);
  });

  it('still navigates to MyRequests when request state refresh fails', async () => {
    const navigate = jest.fn();

    await completeRequestSubmission(async () => {
      throw new Error('refresh failed');
    }, navigate);

    expect(navigate).toHaveBeenCalledWith('MyRequests');
  });
});

describe('completeRequestReset', () => {
  it('refreshes talent navigation state before showing the reset success state', async () => {
    const events: string[] = [];
    let releaseRefresh: (() => void) | undefined;

    const onRequestsChanged = jest.fn(() => new Promise<void>(resolve => {
      events.push('refresh-start');
      releaseRefresh = () => {
        events.push('refresh-end');
        resolve();
      };
    }));
    const markDone = jest.fn(() => {
      events.push('done');
    });

    const flow = completeRequestReset(onRequestsChanged, markDone);

    expect(events).toEqual(['refresh-start']);

    releaseRefresh?.();
    await flow;

    expect(events).toEqual(['refresh-start', 'refresh-end', 'done']);
  });
});
