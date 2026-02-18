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

  useEffect(() => {
    // Title
    const title = metadata?.title || defaultTitle || 'NicoXpress';
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

    // Basic meta tags
    setMetaTag('description', metadata?.meta_description || defaultDescription || null);
    setMetaTag('keywords', metadata?.keywords);

    // Open Graph
    setMetaTag('og:title', metadata?.og_title || metadata?.title || defaultTitle || null, true);
    setMetaTag('og:description', metadata?.og_description || metadata?.meta_description || defaultDescription || null, true);
    setMetaTag('og:image', metadata?.og_image, true);
    setMetaTag('og:url', metadata?.canonical_url || window.location.href, true);
    setMetaTag('og:type', 'website', true);

    // Twitter Card
    setMetaTag('twitter:card', metadata?.twitter_card || 'summary_large_image');
    setMetaTag('twitter:title', metadata?.twitter_title || metadata?.og_title || metadata?.title || defaultTitle || null);
    setMetaTag('twitter:description', metadata?.twitter_description || metadata?.og_description || metadata?.meta_description || defaultDescription || null);
    setMetaTag('twitter:image', metadata?.twitter_image || metadata?.og_image);

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (metadata?.canonical_url) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute('href', metadata.canonical_url);
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
