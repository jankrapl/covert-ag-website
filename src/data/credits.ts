// Photos by other people, credited in the legal notice (src/views/Impressum.astro). Their licences
// require the author, the licence and the source, and a note that the image was changed. Add an entry
// whenever a master in assets/photos comes from someone else; keep `image` equal to its file name.

export interface Credit {
  image: string;
  subject: { de: string; en: string };
  used: { de: string; en: string };
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  changes: { de: string; en: string };
}

const resized = { de: 'verkleinert und zugeschnitten', en: 'resized and cropped' };

export const credits: Credit[] = [
  {
    image: 'home-hero',
    subject: { de: 'Altstadt Olten mit der Holzbrücke, 28. Dezember 2009', en: 'Olten old town with the wooden bridge, 28 December 2009' },
    used: { de: 'Startseite', en: 'Home page' },
    author: 'Konweb4460',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Olten_Aare.jpg',
    changes: resized,
  },
  {
    image: 'bridge-inside',
    subject: { de: 'Im Inneren der Alten Brücke, Olten, 2012', en: 'Inside the old wooden bridge, Olten, 2012' },
    used: { de: 'Startseite und Berufliche Vorsorge, Abschnitt zum Vorgehen', en: 'Home page and occupational pensions, process section' },
    author: 'Zairon',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Olten_Alte_Br%C3%BCcke_09.jpg',
    changes: resized,
  },
  {
    image: 'olten-1955',
    subject: { de: 'Olten aus der Luft, 3. Juni 1955', en: 'Olten from the air, 3 June 1955' },
    used: { de: 'Über Coverd', en: 'About Coverd' },
    author: 'Werner Friedli, ETH-Bibliothek Zürich, Bildarchiv (LBS_H1-018513)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:ETH-BIB-Olten-LBS_H1-018513.tif',
    changes: resized,
  },
];
