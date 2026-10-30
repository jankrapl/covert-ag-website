import type { Lang } from '../i18n';

export interface Person {
  name: string;
  photo: string;
  linkedin?: string;
  role: Record<Lang, string>;
  focus: Record<Lang, string>;
  tags: Record<Lang, string[]>;
}

export const team: Person[] = [
  {
    name: 'Jan Krapl',
    photo: 'jan',
    linkedin: 'https://www.linkedin.com/in/jan-krapl-6b7207275/',
    role: { de: 'Geschäftsführer, Mitinhaber', en: 'Managing Director, Co-Owner' },
    focus: { de: 'Versicherungen & Unternehmen.', en: 'Insurance & Business.' },
    tags: {
      de: ['Versicherungen', 'In Ausbildung: dipl. Berater berufliche Vorsorge IAF'],
      en: ['Insurance', 'In training: Certified Occupational Pension Advisor IAF'],
    },
  },
  {
    name: 'Luca Ferrari',
    photo: 'luca',
    linkedin: 'https://www.linkedin.com/in/luca-ferrari-160453121/',
    role: { de: 'Mitinhaber, Steuerexperte in Ausbildung', en: 'Co-Owner, Tax Expert in Training' },
    focus: { de: 'Steuern & Unternehmensberatung.', en: 'Taxes & Business Consulting.' },
    tags: { de: ['Steuern', 'M.A. HSG Accounting & Finance'], en: ['Taxes', 'M.A. HSG Accounting & Finance'] },
  },
  {
    name: 'Nicolas Schneider',
    photo: 'nicolas',
    linkedin: 'https://www.linkedin.com/in/nicolassschneider/',
    role: { de: 'Mitinhaber', en: 'Co-Owner' },
    focus: { de: 'Vorsorge & Finanzplanung.', en: 'Pension Planning & Financial Planning.' },
    tags: { de: ['M.A. HSG Unternehmensführung'], en: ['M.A. HSG Business Management'] },
  },
  {
    name: 'Dominique',
    photo: 'dominique',
    role: { de: 'Dipl. Steuerexperte', en: 'Certified Tax Expert' },
    focus: { de: 'Komplexere steuerliche Fragestellungen.', en: 'Complex tax matters.' },
    tags: { de: ['Steuern'], en: ['Taxes'] },
  },
];
