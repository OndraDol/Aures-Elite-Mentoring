import { GraphFI } from '@pnp/graph';
import '@pnp/graph/users';
import '@pnp/graph/mail';

import { IMentor, ITalent } from './interfaces';

/**
 * Odeslani emailu pres Microsoft Graph API (sendMail).
 * Vyzaduje opravneni Mail.Send schvalene v SharePoint Admin Center → API access.
 * Email je odeslan ze schrany prihlaseneho uzivatele (delegovane opravneni).
 */
export class NotificationService {
  constructor(private readonly _graph: GraphFI) {}

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
    await this._send(
      [hrEmail],
      `Aures Elite Mentoring – Nova zadost o mentoring [${requestTitle}]`,
      this._buildHRSubmitBody(talent, mentor, requestId, requestTitle)
    );
  }

  /** Reject + zadny dalsi mentor: notifikuje HR o eskalaci */
  async notifyHROnEscalation(
    hrEmail: string,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    await this._send(
      [hrEmail],
      `Aures Elite Mentoring – HR Review vyzadovan [${requestTitle}]`,
      this._buildHREscalationBody(talent, requestId, requestTitle)
    );
  }

  /** Approve: notifikuje HR o schvaleni zadosti */
  async notifyOnApproval(
    hrEmail: string,
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    await this._send(
      [hrEmail],
      `Aures Elite Mentoring – Zadost schvalena [${requestTitle}]`,
      this._buildApprovalBody(talent, mentor, requestId, requestTitle)
    );
  }

  // ----------------------------------------------------------------
  // Soukrome helpery
  // ----------------------------------------------------------------

  private async _send(to: string[], subject: string, body: string): Promise<void> {
    try {
      await this._graph.me.sendMail({
        message: {
          subject,
          body: { contentType: 'HTML', content: body },
          toRecipients: to.map(addr => ({ emailAddress: { address: addr } }))
        },
        saveToSentItems: false
      });
    } catch (err) {
      // Logujeme chybu, ale nenechame ji shodil UI — notifikace jsou best-effort
      console.error('[NotificationService] sendMail selhal:', err);
    }
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
