import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/site-users/web';

import { ICurrentUser, IMentor, ITalent, UserRole } from './interfaces';
import { MentoringService } from './MentoringService';

export class RoleService {
  private readonly _mentoring: MentoringService;

  constructor(private readonly _sp: SPFI, private readonly _hrEmails: string[] = []) {
    this._mentoring = new MentoringService(_sp);
  }

  /**
   * Zjisti aktualne prihlaseneho uzivatele a jeho role.
   * HR role se detekuje porovnanim emailu s konfigurovanym seznamem hrEmails.
   */
  async getCurrentUser(): Promise<ICurrentUser> {
    const spUser = await this._sp.web.currentUser();

    const [mentorRecord, talentRecord] = await Promise.all([
      this._mentoring.getMentorByEmail(spUser.Email),
      this._mentoring.getTalentByEmail(spUser.Email)
    ]);

    const isHR = this._hrEmails.some(e => e.toLowerCase() === spUser.Email.toLowerCase());
    const roles = this._resolveRoles(mentorRecord, talentRecord, isHR);

    return {
      id: spUser.Id,
      title: spUser.Title,
      email: spUser.Email,
      roles,
      mentorRecord,
      talentRecord
    };
  }

  // ----------------------------------------------------------------
  // Soukrome helpery
  // ----------------------------------------------------------------

  private _resolveRoles(
    mentor: IMentor | undefined,
    talent: ITalent | undefined,
    isHR: boolean
  ): UserRole[] {
    const roles: UserRole[] = [];
    if (mentor) roles.push(UserRole.Mentor);
    if (talent) roles.push(UserRole.Talent);
    if (isHR)   roles.push(UserRole.HR);
    if (roles.length === 0) roles.push(UserRole.Unknown);
    return roles;
  }
}
