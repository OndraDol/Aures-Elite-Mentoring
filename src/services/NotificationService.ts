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

  /** Submit: notifikuje Mentora 1 o nove zadosti */
  async notifyMentorOnSubmit(
    mentor: IMentor,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: [mentor.MentorUser?.EMail ?? ''],
      Subject: `Aures Elite Mentoring – Nova zadost o mentoring [${requestTitle}]`,
      Body: this._buildMentorRequestBody(mentor, talent, requestId, requestTitle)
    };
    await this._send(email);
  }

  /** Reject + dalsi mentor: notifikuje nasledujiciho mentora */
  async notifyNextMentorOnReject(
    nextMentor: IMentor,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: [nextMentor.MentorUser?.EMail ?? ''],
      Subject: `Aures Elite Mentoring – Zadost o mentoring ceka na Vase vyjadreni [${requestTitle}]`,
      Body: this._buildMentorRequestBody(nextMentor, talent, requestId, requestTitle)
    };
    await this._send(email);
  }

  /** Reject + zadny dalsi mentor: notifikuje HR o eskalaci */
  async notifyHROnEscalation(
    hrEmail: string,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const email: IEmailProperties = {
      To: [hrEmail],
      Subject: `Aures Elite Mentoring – HR Review vyzadovan [${requestTitle}]`,
      Body: this._buildHREscalationBody(talent, requestId, requestTitle)
    };
    await this._send(email);
  }

  /** Approve: notifikuje HR i Talenta ke sjednanemu mentoringu */
  async notifyOnApproval(
    hrEmail: string,
    talent: ITalent,
    mentor: IMentor,
    requestId: number,
    requestTitle: string
  ): Promise<void> {
    const talentEmail = talent.TalentUser?.EMail ?? '';
    const email: IEmailProperties = {
      To: [hrEmail],
      CC: talentEmail ? [talentEmail] : [],
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

  private _buildMentorRequestBody(
    mentor: IMentor,
    talent: ITalent,
    requestId: number,
    requestTitle: string
  ): string {
    return `
<p>Vazeny/a ${mentor.Title},</p>
<p>
  Talent <strong>${talent.Title}</strong> Vas pozadal/a o mentoring.
  Cilem je profesni rust v ramci Aures Holdings.
</p>
<p>
  <strong>ID zadosti:</strong> ${requestTitle}<br/>
  <strong>ID zaznamu:</strong> ${requestId}
</p>
<p>
  Prosim, otevrete aplikaci Aures Elite Mentoring v SharePointu a zadost schvalte nebo zamitnte.
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
  Prosim koordinujte nasledne kroky — naplanovani uvodni schuze mezi talentem a mentorem.
</p>
<p>S pozdravem,<br/>Aures Elite Mentoring System</p>
    `.trim();
  }
}
