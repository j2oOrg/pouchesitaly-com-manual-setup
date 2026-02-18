import { usePageViewTracking } from '@/hooks/useAnalyticsTracking';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageViewTracking();
  return <>{children}</>;
}
