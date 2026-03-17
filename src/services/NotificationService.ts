import { SPFI } from '@pnp/sp';
import '@pnp/sp/sputilities';
import { IEmailProperties } from '@pnp/sp/sputilities';

import { IMentor, ITalent } from './interfaces';

/**
 * Odeslani emailu pres SP Utility.sendEmail (client-side, bez Power Automate).
 * Vyzaduje ze odesilajici uzivatel ma pravo odesilat maily pres SP.
 */
export class NotificationService {
  constructor(private readonly _sp: SPFI) {}

  // ----------------------------------------------------------------
  // Verejne metody
  // ----------------------------------------------------------------

  /** Submit: notifikuje HR o nove zadosti */
  async notifyHROnSubmit(
    hrEmails: string[],
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: hrEmails,
      Subject: `Aures Elite Mentoring – Nová žádost o mentoring [${requestTitle}]`,
      Body: this._buildHRSubmitBody(talent, mentor, requestId, requestTitle)
    };
    await this._send(email);
  }

  /** Reject + zadny dalsi mentor: notifikuje HR o eskalaci */
  async notifyHROnEscalation(
    hrEmails: string[],
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: hrEmails,
      Subject: `Aures Elite Mentoring – HR Review vyzadovan [${requestTitle}]`,
      Body: this._buildHREscalationBody(talent, requestId, requestTitle)
    };
    await this._send(email);
  }

  /** Approve: notifikuje HR o schvaleni zadosti */
  async notifyOnApproval(
    hrEmails: string[],
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: hrEmails,
      Subject: `Aures Elite Mentoring – Zadost schvalena [${requestTitle}]`,
      Body: this._buildApprovalBody(talent, mentor, requestId, requestTitle)
    };
    await this._send(email);
  }

  // ----------------------------------------------------------------
  // Soukrome helpery
  // ----------------------------------------------------------------

  private async _send(email: IEmailProperties): Promise<void> {
    try {
      await this._sp.utility.sendEmail(email);
    } catch (err) {
      // Logujeme chybu, ale nenechame ji shodil UI — notifikace jsou best-effort
      console.error('[NotificationService] sendEmail selhal:', err);
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
