import { IMentor, ITalent } from './interfaces';

/**
 * NotificationService — stub připravený pro Power Automate integraci.
 * SP.Utility.sendEmail je odstraněno (není spolehlivé v SPO prostředí).
 * Notifikace budou triggrovány přes Power Automate flow navázané na seznam MentoringRequests.
 * Metody jsou zachovány pro kompatibilitu s volajícím kódem, ale neprovádí žádnou akci.
 */
export class NotificationService {
  // Power Automate bude reagovat automaticky na změny v MentoringRequests listu.
  // Žádná aktivní implementace zde není potřeba.

  async notifyHROnSubmit(
    _hrEmails: string[],
    _talent: ITalent,
    _mentor: IMentor,
    _requestId: number,
    _requestTitle: string
  ): Promise<void> {
    void [_hrEmails, _talent, _mentor, _requestId, _requestTitle];
    // Power Automate trigger — implementace na straně flow
  }

  async notifyHROnEscalation(
    _hrEmails: string[],
    _talent: ITalent,
    _requestId: number,
    _requestTitle: string
  ): Promise<void> {
    void [_hrEmails, _talent, _requestId, _requestTitle];
    // Power Automate trigger — implementace na straně flow
  }

  async notifyOnApproval(
    _hrEmails: string[],
    _talent: ITalent,
    _mentor: IMentor,
    _requestId: number,
    _requestTitle: string
  ): Promise<void> {
    void [_hrEmails, _talent, _mentor, _requestId, _requestTitle];
    // Power Automate trigger — implementace na straně flow
  }
}
