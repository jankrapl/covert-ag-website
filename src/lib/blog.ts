import type { CollectionEntry } from 'astro:content';
import { routes, type Lang } from '../i18n';
import type { BookingTopic } from '../data/site';

export const categories = {
  vorsorge: { de: 'Versicherungen & Vorsorge', en: 'Insurance & Pension Planning' },
  steuern: { de: 'Steuern & Finanzen', en: 'Taxes & Finance' },
  coverd: { de: 'Aktuelles von Coverd', en: 'News from Coverd' },
} as const;

// Entry ids look like "de/bvg-wechsel-kmu".
export const postSlug = (p: CollectionEntry<'blog'>) => p.id.split('/').pop() as string;
export const postPath = (p: CollectionEntry<'blog'>) => `${routes.blog[p.data.lang]}${postSlug(p)}/`;

export function readingTime(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / 210));
}

export const postImageAlt: Record<string, Record<Lang, string>> = {
  'vorsorge-ahv-zahlen-2027': { de: 'Schweizer Münzen in aufsteigenden Stapeln auf einem Eichentisch', en: 'Swiss coins in rising stacks on an oak table' },
  'bvg-wechsel-kmu': { de: 'Geschäftsführer bespricht mit der Belegschaft einen Plan am Tisch', en: 'A managing director discussing a plan with the staff at a table' },
  'steuern-sparen-saeule-3a': { de: 'Glas mit Schweizer Münzen neben einem jungen Setzling auf einem Fenstersims', en: 'A jar of Swiss coins next to a young seedling on a windowsill' },
  'kuendigungsfristen-versicherungen-privat': { de: 'Eine Hand wirft einen Brief in einen gelben Briefkasten', en: 'A hand posting a letter into a yellow letterbox' },
  'kuendigungsfristen-versicherungen-kmu': { de: 'Mitarbeiterin zieht einen Bundesordner aus dem Regal', en: 'An employee pulling a lever arch file from the shelf' },
  'bvg-loesung-talente-gewinnen': { de: 'Zwei Personen begrüssen sich mit Handschlag in einer Werkstatt', en: 'Two people greeting each other with a handshake in a workshop' },
};

// Call to action at the end of each article, carried over from the original posts.
export const postCta: Record<string, { label: Record<Lang, string>; topic: BookingTopic }> = {
  'vorsorge-ahv-zahlen-2027': { label: { de: 'Vorsorge-Check vereinbaren', en: 'Book a Pension Check' }, topic: 'vorsorge' },
  'bvg-wechsel-kmu': { label: { de: 'BVG prüfen lassen', en: 'Get Your BVG Reviewed' }, topic: 'bvg' },
  'steuern-sparen-saeule-3a': { label: { de: 'Steuersituation besprechen', en: 'Discuss Your Tax Situation' }, topic: 'steuern' },
  'kuendigungsfristen-versicherungen-privat': { label: { de: 'Meine Situation prüfen', en: 'Check My Situation' }, topic: 'privat' },
  'kuendigungsfristen-versicherungen-kmu': { label: { de: 'Unternehmen analysieren lassen', en: 'Get Your Business Analyzed' }, topic: 'unternehmen' },
  'bvg-loesung-talente-gewinnen': { label: { de: 'BVG prüfen lassen', en: 'Get Your BVG Reviewed' }, topic: 'bvg' },
};
