import { SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/site-users/web';

import { ICurrentUser, IMentor, ITalent, UserRole } from './interfaces';
import { MentoringService } from './MentoringService';

/** Nazev SP skupiny, jejiz clenove maji roli HR */
const HR_GROUP_NAME = 'Aures Mentoring HR';

export class RoleService {
  private readonly _mentoring: MentoringService;

  constructor(private readonly _sp: SPFI) {
    this._mentoring = new MentoringService(_sp);
  }

  /**
   * Zjisti aktualne prihlaseneho uzivatele a jeho role.
   * Role se detekuji paralelne — uzivatel muze mit vice roli zaroven (napr. Talent + Mentor).
   */
  async getCurrentUser(): Promise<ICurrentUser> {
    const spUser = await this._sp.web.currentUser();

    const [mentorRecord, talentRecord, isHR] = await Promise.all([
      this._mentoring.getMentorByEmail(spUser.Email),
      this._mentoring.getTalentByEmail(spUser.Email),
      this._checkHRMembership(spUser.Id)
    ]);

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

  /**
   * Zkontroluje, zda uzivatel patri do SP skupiny HR_GROUP_NAME.
   * Pokud skupina neexistuje nebo nastane jina chyba, vraci false (fail-safe).
   */
  private async _checkHRMembership(userId: number): Promise<boolean> {
    try {
      const groups: { Title: string }[] = await this._sp.web.siteUsers
        .getById(userId)
        .groups();
      return groups.some(g => g.Title === HR_GROUP_NAME);
    } catch {
      return false;
    }
  }
}
