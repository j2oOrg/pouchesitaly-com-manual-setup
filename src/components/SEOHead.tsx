import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useLanguage } from '@/context/LanguageContext';

interface SEOHeadProps {
  defaultTitle?: string;
  defaultDescription?: string;
}

export function SEOHead({ defaultTitle, defaultDescription }: SEOHeadProps) {
  const location = useLocation();
  const { language } = useLanguage();
  
  const { data: metadata } = usePageMetadata(location.pathname, language);
  const canonicalPath = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
  const canonicalUrl = `https://pouchesitaly.com${canonicalPath || "/"}`;
  const isItalian = language === "it";

  const fallback = {
    title: isItalian
      ? "Pouchesitaly - Pouches da nicotina premium con spedizione mondiale"
      : "Pouchesitaly - Premium Nicotine Pouches | Fast Worldwide Shipping",
    description: isItalian
      ? "Acquista pouches da nicotina premium online: marchi come ZYN, VELO e LYFT, consegna rapida e packaging discreto in tutta Italia e nel mondo."
      : "Shop premium nicotine pouches from trusted brands like ZYN, VELO, and LYFT. Fast delivery and discreet packaging available globally.",
    keywords: "pouchesitaly, nicotine pouches, snus, ZYN, VELO, LYFT, tobacco-free pouches, premium nicotine pouches, buy online",
    ogTitle: isItalian
      ? "Pouchesitaly | Pouches premium per una pausa intensa e discreta"
      : "Pouchesitaly | Premium Nicotine Pouches for Everyday Energy",
    ogDescription: isItalian
      ? "Consegna rapida, prodotti autentici e discreti per un'esperienza pratica."
      : "Authentic nicotine pouches, discreet shopping, and worldwide shipping to bring your favorites to you.",
    image: "https://pouchesitaly.com/socialshare.png",
    twitterSite: "@Pouchesitaly",
  };

  useEffect(() => {
    // Title
    const title = metadata?.title || defaultTitle || fallback.title;
    document.title = title;

    // Helper to set or remove meta tags
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

    // Basic meta tags
    setMetaTag('description', finalDescription);
    setMetaTag('keywords', metadata?.keywords || fallback.keywords);
    setMetaTag('robots', 'index, follow');
    setMetaTag('author', 'Pouchesitaly');
    setMetaTag('geo.region', 'IT');
    setMetaTag('geo.placename', 'Italy');

    // Open Graph
    setMetaTag('og:title', metadata?.og_title || metadata?.title || fallback.ogTitle, true);
    setMetaTag('og:description', metadata?.og_description || metadata?.meta_description || fallback.ogDescription, true);
    setMetaTag('og:image', metadata?.og_image || fallback.image, true);
    setMetaTag('og:url', metadata?.canonical_url || canonicalUrl, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:locale', isItalian ? 'it_IT' : 'en_US', true);
    setMetaTag('og:site_name', 'Pouchesitaly', true);

    // Twitter Card
    setMetaTag('twitter:card', metadata?.twitter_card || 'summary_large_image');
    setMetaTag('twitter:site', fallback.twitterSite);
    setMetaTag('twitter:creator', fallback.twitterSite);
    setMetaTag('twitter:title', metadata?.twitter_title || metadata?.og_title || metadata?.title || fallback.ogTitle);
    setMetaTag('twitter:description', metadata?.twitter_description || metadata?.og_description || metadata?.meta_description || fallback.ogDescription);
    setMetaTag('twitter:image', metadata?.twitter_image || metadata?.og_image || fallback.image);

    // Canonical URL
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

    // Cleanup function
    return () => {
      // Reset title on unmount if needed
    };
  }, [metadata, defaultTitle, defaultDescription]);

  return null;
}

