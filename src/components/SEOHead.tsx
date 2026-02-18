import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useLanguage } from '@/context/LanguageContext';

interface SEOHeadProps {
  defaultTitle?: string;
  defaultDescription?: string;
  noindex?: boolean;
}

type Locale = 'en' | 'it';

const BASE_URL = 'https://pouchesitaly.com';

const stripLocalePrefix = (path: string) => {
  const withoutPrefix = path.replace(/^\/(?:en|it)(?=\/|$)/, '');
  const normalized = withoutPrefix === '' ? '/' : withoutPrefix;
  return normalized === '/' ? '/' : normalized.replace(/\/$/, '');
};

const localizedPath = (path: string, locale: Locale) =>
  locale === 'it' ? path : (path === '/' ? '/en' : `/en${path}`);

export function SEOHead({ defaultTitle, defaultDescription, noindex = false }: SEOHeadProps) {
  const location = useLocation();
  const { language } = useLanguage();

  const metadataPath = stripLocalePrefix(location.pathname);
  const { data: metadata } = usePageMetadata(metadataPath, language);

  const isItalian = language === 'it';
  const canonicalUrl = `${BASE_URL}${localizedPath(metadataPath, language)}`;
  const alternateItalian = `${BASE_URL}${localizedPath(metadataPath, 'it')}`;
  const alternateEnglish = `${BASE_URL}${localizedPath(metadataPath, 'en')}`;

  const fallback = {
    title: isItalian
      ? 'Pouchesitaly - Pouches da nicotina premium con spedizione mondiale'
      : 'Pouchesitaly - Premium Nicotine Pouches | Fast Worldwide Shipping',
    description: isItalian
      ? 'Acquista pouches da nicotina premium online: marchi come ZYN, VELO e LYFT, consegna rapida e packaging discreto in tutta Italia e nel mondo.'
      : 'Shop premium nicotine pouches from trusted brands like ZYN, VELO, and LYFT. Fast delivery and discreet packaging available globally.',
    keywords: 'pouchesitaly, nicotine pouches, snus, ZYN, VELO, LYFT, tobacco-free pouches, premium nicotine pouches, buy online',
    ogTitle: isItalian
      ? 'Pouchesitaly | Pouches premium per una pausa intensa e discreta'
      : 'Pouchesitaly | Premium Nicotine Pouches for Everyday Energy',
    ogDescription: isItalian
      ? 'Consegna rapida, prodotti autentici e discreti per un\'esperienza pratica.'
      : 'Authentic nicotine pouches, discreet shopping, and worldwide shipping to bring your favorites to you.',
    image: 'https://pouchesitaly.com/socialshare.png',
    twitterSite: '@Pouchesitaly',
  };

  useEffect(() => {
    const title = metadata?.title || defaultTitle || fallback.title;
    document.title = title;
    document.documentElement.setAttribute('lang', isItalian ? 'it' : 'en');

    const setMetaTag = (name: string, content: string | null, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (content) {
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      } else if (element) {
        element.remove();
      }
    };

    const finalDescription = metadata?.meta_description || defaultDescription || fallback.description;

    setMetaTag('description', finalDescription);
    setMetaTag('keywords', metadata?.keywords || fallback.keywords);
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('author', 'Pouchesitaly');
    setMetaTag('geo.region', 'IT');
    setMetaTag('geo.placename', 'Italy');

    setMetaTag('og:title', metadata?.og_title || metadata?.title || fallback.ogTitle, true);
    setMetaTag('og:description', metadata?.og_description || metadata?.meta_description || fallback.ogDescription, true);
    setMetaTag('og:image', metadata?.og_image || fallback.image, true);
    setMetaTag('og:url', metadata?.canonical_url || canonicalUrl, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:locale', isItalian ? 'it_IT' : 'en_US', true);
    setMetaTag('og:site_name', 'Pouchesitaly', true);

    const setAlternateLocale = (value: string) => {
      let alternateLocale = document.querySelector(
        `meta[property="og:locale:alternate"][content="${value}"]`
      ) as HTMLMetaElement | null;
      if (!alternateLocale) {
        alternateLocale = document.createElement('meta');
        alternateLocale.setAttribute('property', 'og:locale:alternate');
        document.head.appendChild(alternateLocale);
      }
      alternateLocale.setAttribute('content', value);
    };

    setMetaTag('twitter:card', metadata?.twitter_card || 'summary_large_image');
    setMetaTag('twitter:site', fallback.twitterSite);
    setMetaTag('twitter:creator', fallback.twitterSite);
    setMetaTag('twitter:title', metadata?.twitter_title || metadata?.og_title || metadata?.title || fallback.ogTitle);
    setMetaTag('twitter:description', metadata?.twitter_description || metadata?.og_description || metadata?.meta_description || fallback.ogDescription);
    setMetaTag('twitter:image', metadata?.twitter_image || metadata?.og_image || fallback.image);

    let canonicalElement = document.querySelector('link[rel="canonical"]');
    const canonicalHref = metadata?.canonical_url || canonicalUrl;

    if (canonicalHref) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute('href', canonicalHref);
    } else if (canonicalElement) {
      canonicalElement.remove();
    }

    const removeAlternateLinks = () => {
      const existing = document.querySelectorAll('link[rel="alternate"][hreflang]');
      existing.forEach((node) => node.remove());
    };

    const removeAlternateLocale = () => {
      const existing = document.querySelectorAll('meta[property="og:locale:alternate"]');
      existing.forEach((node) => node.remove());
    };

    const setAlternateLink = (hrefLang: string, href: string) => {
      let alternate = document.querySelector(`link[rel="alternate"][hreflang="${hrefLang}"]`) as HTMLLinkElement | null;
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.setAttribute('rel', 'alternate');
        alternate.setAttribute('hreflang', hrefLang);
        document.head.appendChild(alternate);
      }
      alternate.setAttribute('href', href);
    };

    removeAlternateLinks();
    setAlternateLink('en', alternateEnglish);
    setAlternateLink('it', alternateItalian);
    setAlternateLink('x-default', alternateItalian);

    removeAlternateLocale();
    if (isItalian) {
      setAlternateLocale('en_US');
    } else {
      setAlternateLocale('it_IT');
    }

    return () => {
      removeAlternateLinks();
      removeAlternateLocale();
    };
  }, [
    metadata,
    defaultTitle,
    defaultDescription,
    location.pathname,
    noindex,
    isItalian,
    canonicalUrl,
    alternateItalian,
    alternateEnglish,
  ]);

  return null;
}
