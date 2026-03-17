import { IMentor } from '../../../../services/interfaces';

interface IMentorAvatarConfig {
  src: string;
  position: string;
  ids: number[];
  aliases: string[];
}

const topolovaPhoto: string = require('../../assets/mentors/topolova.jpg');
const vanecekPhoto: string = require('../../assets/mentors/vanecek.jpg');
const hrudnikPhoto: string = require('../../assets/mentors/hrudnik.jpg');
const vorlikPhoto: string = require('../../assets/mentors/vorlik.jpg');
const lunacekPhoto: string = require('../../assets/mentors/lunacek.jpg');
const vapenikPhoto: string = require('../../assets/mentors/vapenik.jpg');
const vorsilkovaPhoto: string = require('../../assets/mentors/vorsilkova.jpg');
const vobornikovaPhoto: string = require('../../assets/mentors/vobornikova.png');
const batekPhoto: string = require('../../assets/mentors/batek.jpg');
const svobodaPhoto: string = require('../../assets/mentors/svoboda.jpg');

const DEFAULT_POSITION = '50% 24%';

const MENTOR_AVATARS: IMentorAvatarConfig[] = [
  { src: topolovaPhoto, position: '50% 24%', ids: [1], aliases: ['karolina topolova', 'karolina.topolova', 'topolova'] },
  { src: vanecekPhoto, position: '50% 24%', ids: [2], aliases: ['petr vanecek', 'petr.vanecek', 'vanecek'] },
  { src: hrudnikPhoto, position: '50% 28%', ids: [4], aliases: ['martin hrudnik', 'martin.hrudnik', 'hrudnik'] },
  { src: vorlikPhoto, position: '50% 26%', ids: [3], aliases: ['lubos vorlik', 'lubos.vorlik', 'vorlik'] },
  { src: lunacekPhoto, position: '50% 22%', ids: [5], aliases: ['daniel lunacek', 'daniel.lunacek', 'lunacek'] },
  { src: vapenikPhoto, position: '50% 30%', ids: [7], aliases: ['miroslav vapenik', 'miroslav.vapenik', 'vapenik'] },
  { src: vorsilkovaPhoto, position: '50% 20%', ids: [10], aliases: ['marie vorsilkova', 'marie.vorsilkova', 'vorsilkova'] },
  { src: vobornikovaPhoto, position: '50% 38%', ids: [9], aliases: ['zuzana vobornikova', 'zuzana.vobornikova', 'vobornikova'] },
  { src: batekPhoto, position: '50% 26%', ids: [6], aliases: ['zdenek batek', 'zdenek.batek', 'batek'] },
  { src: svobodaPhoto, position: '50% 26%', ids: [8], aliases: ['alen svoboda', 'alen.svoboda', 'svoboda'] }
];

const MENTOR_AVATARS_BY_ID: Record<number, IMentorAvatarConfig> = {};
const MENTOR_AVATARS_BY_ALIAS: Record<string, IMentorAvatarConfig> = {};

MENTOR_AVATARS.forEach(config => {
  config.ids.forEach(id => {
    MENTOR_AVATARS_BY_ID[id] = config;
  });

  config.aliases.forEach(alias => {
    MENTOR_AVATARS_BY_ALIAS[normalizeLookup(alias)] = config;
  });
});

export interface IResolvedMentorAvatar {
  src: string;
  position: string;
}

export function resolveMentorAvatar(mentor: Pick<IMentor, 'Id' | 'Title' | 'PhotoUrl' | 'MentorUser'>): IResolvedMentorAvatar | undefined {
  const fallback = resolveMentorAvatarFallback(mentor);
  const explicitUrl = mentor.PhotoUrl?.trim();

  if (explicitUrl) {
    return {
      src: explicitUrl,
      position: fallback?.position ?? DEFAULT_POSITION
    };
  }

  return fallback;
}

function resolveMentorAvatarFallback(mentor: Pick<IMentor, 'Id' | 'Title' | 'MentorUser'>): IResolvedMentorAvatar | undefined {
  const byId = MENTOR_AVATARS_BY_ID[mentor.Id];
  if (byId) {
    return byId;
  }

  const candidates = [
    mentor.Title,
    mentor.MentorUser?.Title,
    mentor.MentorUser?.EMail,
    mentor.MentorUser?.EMail?.split('@')[0],
    mentor.MentorUser?.EMail?.split('@')[0]?.replace(/\./g, ' ')
  ].filter((value): value is string => Boolean(value && value.trim()));

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeLookup(candidate);
    const exactMatch = MENTOR_AVATARS_BY_ALIAS[normalizedCandidate];

    if (exactMatch) {
      return exactMatch;
    }

    const partialMatch = MENTOR_AVATARS.find(config =>
      config.aliases.some(alias => {
        const normalizedAlias = normalizeLookup(alias);
        return normalizedCandidate.includes(normalizedAlias) || normalizedAlias.includes(normalizedCandidate);
      })
    );

    if (partialMatch) {
      return partialMatch;
    }
  }

  return undefined;
}

function normalizeLookup(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getMentorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
