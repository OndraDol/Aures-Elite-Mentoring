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
