import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve a persistent visitor ID
function getVisitorId(): string {
  const key = 'nx_visitor_id';
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
}

export function usePageViewTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking the same path twice in quick succession
    if (lastTrackedPath.current === location.pathname) {
      return;
    }
    
    lastTrackedPath.current = location.pathname;
    
    // Don't track admin pages
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
      return;
    }

    const trackPageView = async () => {
      try {
        const visitorId = getVisitorId();
        
        await supabase.from('page_views').insert({
          page_path: location.pathname,
          visitor_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.debug('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
}

export function useProductViewTracking(productId: string | null) {
  const hasTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!productId || hasTracked.current === productId) {
      return;
    }

    hasTracked.current = productId;

    const trackProductView = async () => {
      try {
        const visitorId = getVisitorId();
        
        await supabase.from('product_views').insert({
          product_id: productId,
          visitor_id: visitorId,
        });
      } catch (error) {
        console.debug('Failed to track product view:', error);
      }
    };

    trackProductView();
  }, [productId]);
}

export async function trackCartEvent(
  eventType: 'add' | 'remove' | 'checkout_start' | 'checkout_complete',
  productId?: string,
  quantity?: number
) {
  try {
    const visitorId = getVisitorId();

    await supabase.from('cart_events').insert({
      event_type: eventType,
      product_id: productId || null,
      quantity: quantity || null,
      visitor_id: visitorId,
    });
  } catch (error) {
    console.debug('Failed to track cart event:', error);
  }
}
