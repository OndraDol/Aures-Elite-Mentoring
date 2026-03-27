import { NavigateFn } from '../AppView';

export async function completeRequestSubmission(
  onRequestsChanged: (() => Promise<void>) | undefined,
  navigate: NavigateFn
): Promise<void> {
  try {
    if (onRequestsChanged) {
      await onRequestsChanged();
    }
  } finally {
    navigate('MyRequests');
  }
}

export async function completeRequestReset(
  onRequestsChanged: (() => Promise<void>) | undefined,
  markDone: () => void
): Promise<void> {
  if (onRequestsChanged) {
    await onRequestsChanged();
  }

  markDone();
}
