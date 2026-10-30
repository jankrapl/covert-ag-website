import { site } from '../data/site';
import { url, type Lang } from '../i18n';

const abs = (path: string) => new URL(path, site.url).href;

export function organization(lang: Lang) {
  const address = site.address
    ? { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.zip, addressLocality: site.address.city, addressCountry: 'CH' }
    : { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'CH' };
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.brand,
    url: abs(url('home', lang)),
    logo: abs('/logo.png'),
    image: abs('/og/home-hero.jpg'),
    email: site.email,
    ...(site.phone ? { telephone: site.phone.label } : {}),
    address,
    areaServed: { '@type': 'Country', name: 'Switzerland' },
    foundingDate: String(site.founded),
    knowsLanguage: ['de', 'en'],
    slogan: lang === 'de' ? 'Ein Partner. Alles im Blick.' : 'One partner. Everything in view.',
  };
}

export function website(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: abs(url('home', lang)),
    name: site.brand,
    inLanguage: lang === 'de' ? 'de-CH' : 'en',
    publisher: { '@id': `${site.url}/#organization` },
  };
}

export function breadcrumbs(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.href) })),
  };
}

export function service(lang: Lang, name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: abs(path),
    areaServed: { '@type': 'Country', name: 'Switzerland' },
    provider: { '@id': `${site.url}/#organization` },
    inLanguage: lang === 'de' ? 'de-CH' : 'en',
  };
}

export function article(opts: { lang: Lang; title: string; description: string; path: string; image: string; date: Date; modified?: Date }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: abs(opts.path),
    image: abs(opts.image),
    datePublished: opts.date.toISOString().slice(0, 10),
    dateModified: (opts.modified ?? opts.date).toISOString().slice(0, 10),
    inLanguage: opts.lang === 'de' ? 'de-CH' : 'en',
    author: { '@id': `${site.url}/#organization` },
    publisher: { '@id': `${site.url}/#organization` },
  };
}
