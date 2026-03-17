import { ITalent } from '../../../../services/interfaces';

const blahakPhoto: string    = require('../../assets/talents/blahak.jpg');
const gabrhelPhoto: string   = require('../../assets/talents/gabrhel.jpg');
const gruberPhoto: string    = require('../../assets/talents/gruber.jpg');
const janovskyPhoto: string  = require('../../assets/talents/janovsky.jpg');
const kamirPhoto: string     = require('../../assets/talents/kamir.jpg');
const kapralekPhoto: string  = require('../../assets/talents/kapralek.jpg');
const krylPhoto: string      = require('../../assets/talents/kryl.jpg');
const kuchynkaPhoto: string  = require('../../assets/talents/kuchynka.jpg');
const matuskaPhoto: string   = require('../../assets/talents/matuska.jpg');
const otcenasekPhoto: string = require('../../assets/talents/otcenasek.jpg');
const parikPhoto: string     = require('../../assets/talents/parik.jpg');
const preusPhoto: string     = require('../../assets/talents/preus.jpg');
const prochazkaPhoto: string = require('../../assets/talents/prochazka.jpg');
const reichPhoto: string     = require('../../assets/talents/reich.jpg');
const rongePhoto: string     = require('../../assets/talents/ronge.jpg');
const strouhalPhoto: string  = require('../../assets/talents/strouhal.jpg');
const svobodaPhoto: string   = require('../../assets/talents/svoboda.jpg');
const sandaPhoto: string     = require('../../assets/talents/sanda.jpg');
const smolPhoto: string      = require('../../assets/talents/smol.jpg');
const sulcPhoto: string      = require('../../assets/talents/sulc.jpg');
const skibaPhoto: string     = require('../../assets/talents/skiba.jpg');

interface ITalentAvatarConfig {
  src: string;
  ids: number[];
  aliases: string[];
}

const TALENT_AVATARS: ITalentAvatarConfig[] = [
  { src: blahakPhoto,    ids: [32069],  aliases: ['marek blahak', 'marek.blahak'] },
  { src: gabrhelPhoto,   ids: [111056], aliases: ['michal gabrhel', 'michal.gabrhel'] },
  { src: gruberPhoto,    ids: [25400],  aliases: ['adam gruber', 'adam.gruber'] },
  { src: janovskyPhoto,  ids: [14233],  aliases: ['martin janovsky', 'martin.janovsky'] },
  { src: kamirPhoto,     ids: [28179],  aliases: ['jiri kamir', 'jiri.kamir'] },
  { src: kapralekPhoto,  ids: [13835],  aliases: ['tomas kapralek', 'tomas.kapralek'] },
  { src: krylPhoto,      ids: [1509],   aliases: ['jan kryl', 'jan.kryl'] },
  { src: kuchynkaPhoto,  ids: [4620],   aliases: ['petr kuchynka', 'petr.kuchynka'] },
  { src: matuskaPhoto,   ids: [12381],  aliases: ['jakub matuska', 'jakub.matuska'] },
  { src: otcenasekPhoto, ids: [11887],  aliases: ['stanislav otcenasek', 'stanislav.otcenasek'] },
  { src: parikPhoto,     ids: [110249], aliases: ['miroslav parik', 'miroslav.parik'] },
  { src: preusPhoto,     ids: [23574],  aliases: ['tomas preus', 'tomas.preus'] },
  { src: prochazkaPhoto, ids: [7042],   aliases: ['dusan prochazka', 'dusan.prochazka'] },
  { src: reichPhoto,     ids: [27487],  aliases: ['david reich', 'david.reich'] },
  { src: rongePhoto,     ids: [8128],   aliases: ['marcel ronge', 'marcel.ronge'] },
  { src: strouhalPhoto,  ids: [27599],  aliases: ['jakub strouhal', 'jakub.strouhal'] },
  { src: svobodaPhoto,   ids: [32407],  aliases: ['daniel svoboda', 'daniel.svoboda'] },
  { src: sandaPhoto,     ids: [27539],  aliases: ['petr sanda', 'petr.sanda'] },
  { src: smolPhoto,      ids: [30798],  aliases: ['robert smol', 'robert.smol'] },
  { src: sulcPhoto,      ids: [15643],  aliases: ['petr sulc', 'petr.sulc'] },
  { src: skibaPhoto,     ids: [70142],  aliases: ['jaroslaw skiba', 'jaroslaw.skiba'] },
];

const BY_ID: Record<number, ITalentAvatarConfig> = {};
const BY_ALIAS: Record<string, ITalentAvatarConfig> = {};

TALENT_AVATARS.forEach(config => {
  config.ids.forEach(id => { BY_ID[id] = config; });
  config.aliases.forEach(alias => { BY_ALIAS[normalize(alias)] = config; });
});

export function resolveTalentPhoto(talent: Pick<ITalent, 'Id' | 'Title' | 'TalentUser'>): string | undefined {
  const byId = BY_ID[talent.Id];
  if (byId) return byId.src;

  const candidates = [
    talent.Title,
    talent.TalentUser?.Title,
    talent.TalentUser?.EMail,
    talent.TalentUser?.EMail?.split('@')[0]?.replace(/\./g, ' ')
  ].filter((v): v is string => Boolean(v?.trim()));

  for (const c of candidates) {
    const exact = BY_ALIAS[normalize(c)];
    if (exact) return exact.src;
    const partial = TALENT_AVATARS.find(cfg =>
      cfg.aliases.some(a => normalize(c).includes(normalize(a)) || normalize(a).includes(normalize(c)))
    );
    if (partial) return partial.src;
  }

  return undefined;
}

export function getTalentInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
